from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserChangeForm, CustomUserCreationForm

from .models import User

# Register your models here.
class CustomUserAdmin(UserAdmin):
    model = User
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    list_display = ("auth_id", "email", "name", "uuid", "is_admin")
    list_filter = list_display
    fieldsets = (
        (None, {"fields": ("auth_id", "email", "name", "password")}),
        ("Permissions", {"fields": ("is_admin",)}),
    )
    readonly_fields = ["auth_id"]
    filter_horizontal = ()
    add_fieldsets = (
        None,
        {
            "classes": ("wide",),
            "fields": ("auth_id", "password1", "password2"),
        },
    )
    search_fields = ("auth_id", "email", "name")
    ordering = ("name",)


admin.site.register(User, CustomUserAdmin)
