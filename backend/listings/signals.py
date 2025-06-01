from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .utils import initialize_categories_and_subcategories


@receiver(post_migrate, sender=None)
def create_categories_and_subcategories(sender, **kwargs):
    initialize_categories_and_subcategories()
