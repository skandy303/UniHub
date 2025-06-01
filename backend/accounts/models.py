from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)
import uuid
from django.contrib import admin


class UserManager(BaseUserManager):
    def create_user(self, auth_id, email="", name="", password="password"):
        if not auth_id:
            raise ValueError("Users must have an auth_id and an email address")

        user = self.model(
            auth_id=auth_id,
            email=self.normalize_email(email),
            name=name,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, auth_id, password):
        user = self.create_user(
            auth_id=auth_id,
            password=password,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):
    objects = UserManager()
    auth_id = models.CharField(default=None, max_length=255, unique=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    stripe_account_id = models.CharField(max_length=255, blank=True)

    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "auth_id"
    REQUIRED_FIELDS = []


class CustomUserAdmin(admin.ModelAdmin):
    filter_horizontal = ()
    list_display = ["auth_id", "email", "name", "admin"]
