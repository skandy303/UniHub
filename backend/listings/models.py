from django.db import models
from accounts.models import User

# Create your models here.
class Listing(models.Model):
    # condType = (
    #     ('BN', 'Brand New'),
    #     ('LU', 'Lightly Used'),
    #     ('U', 'Used'),
    #     ('OB', 'Open Box')
    # )
    # category = {"Books": ["Genres"],
    #             "Electronics":["device type"],
    #             "Furniture":["furniture types"],
    #             "Clothing":["Clothing Types"],
    #             "Services":["Service Types"],
    #             "Vehicles":["Vehicle Types"],
    #             "Other":["Other Types"]
    #             }
    title = models.CharField(max_length=60, null=True)
    content = models.CharField(max_length=600, null=True)
    price = models.FloatField(null=True)
    date = models.DateField(auto_now=True, null=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user", null=True
    )
    condition = models.CharField(max_length=10, null=True)
    category = models.ForeignKey(
        "Category", on_delete=models.SET_NULL, related_name="listings", null=True
    )
    subcategory = models.ForeignKey(
        "Subcategory", on_delete=models.SET_NULL, related_name="listings", null=True
    )

    def __str__(self) -> str:
        return f"Project ({self.pk}): {self.title}, {self.user}"


class Image(models.Model):
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="images"
    )
    file = models.ImageField(upload_to="images/")
    order = models.IntegerField()


class Convos(models.Model):
    # postingId = models.IntegerField()
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="conversations"
    )
    customer = models.CharField(max_length=60)
    meetingKey = models.CharField(max_length=40)


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Subcategory(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="subcategories"
    )

    class Meta:
        unique_together = ("name", "category")

    def __str__(self):
        return self.name
