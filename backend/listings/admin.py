from django.contrib import admin

from .models import Listing, Image, Category, Subcategory

# Register your models here.


class ListingAdmin(admin.ModelAdmin):
    model = Listing
    list_display = ("title", "content", "date", "user", "condition")


class ImagesAdmin(admin.ModelAdmin):
    model = Image
    list_display = ("listing", "file", "order")


class CategoryAdmin(admin.ModelAdmin):
    model = Category
    list_display = ("name",)


class SubcategoryAdmin(admin.ModelAdmin):
    model = Subcategory
    list_display = ("name", "category")


admin.site.register(Listing)
admin.site.register(Image)
