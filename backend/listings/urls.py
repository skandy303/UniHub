from django.urls import include, path
from . import views

urlpatterns = [
    path("getSuggestions", views.DescriptionView.as_view()),
    path("", views.ListingView.as_view()),
    path("user", views.GetUserlistings.as_view()),
    path("categories", views.CategoryView.as_view()),
    path("statistics", views.GetStatistics.as_view()),
    path("categories/<int:id>/subcategories", views.SubCategoryView.as_view()),
    path("createConversation", views.CreateConversation.as_view()),
    path("search", views.SearchListingView.as_view()),
    path("browse", views.BrowseListingView.as_view()),
    path("<int:id>", views.GetListing.as_view()),
    path("images/<int:image_id>/", views.GetImages.as_view(), name="get_image"),
    path("emailDelivered", views.SendGridWebhookView.as_view()),
]
