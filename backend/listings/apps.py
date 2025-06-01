from django.apps import AppConfig


class ListingsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "listings"

    def ready(self):
        # from . import utils
        # utils.initialize_categories_and_subcategories()
        # # pass
        import listings.signals
