# Project: UNIHUB

## Idea:

An advanced all-in-one online marketplace platform, designed to facilitate the buying, selling, and trading of personal items among authenticated and authorized members of the community. The platform will handle everything from finding listings to contacting and messaging sellers to payouts for sellers through secured payments (without additional charges for either parties).

## Demo

[Link to demo video on YouTube](https://youtu.be/iWQ2ktEA0s8)

## Complexity Points

| Feature                                       | Library/API | Complexity Points |
| --------------------------------------------- | ----------- | ----------------- |
| Field suggestions when creating a new listing | OpenAI      | 1                 |
| 2-way user Messaging                          | Twillio     | 2                 |
| User Authentication                           | Auth0       | 1                 |
| Secured Payment to seller                     | Stripe      | 2                 |
| Marketing Emails                              | Send Grid   | 2                 |
| UI/Data Visualization                         | Unovis      | 1                 |
| Total                                         | -           | 9                 |

## Installation

### Backend Setup

**Recommended Python Version: 3.10.6**

1. Setup Python virtual environment

```
cd backend
# Create virtual environment
python3 -m venv env
# Activate virtual environment
source ./env/bin/activate
```

2. Install required dependencies for the backend

```
pip install -r requirements.txt
```

3. Start the backend server

```
python manage.py runserver
```

### Frontend Setup

1. Navigate to the frontend directory from root

```
cd frontend
```

2. Install required dependencies for the frontend

```
npm install
```

3. Start the frontend server

```
npm run start
```

Instructions on how to use the platform:

Step 1: Create an account

- Click on the "Sign In" button on the center of the landing page
- Click on the "Sign Up" option within the Auth0 portal if this is your first time using the platform
- User can login using their email and password, or using their Google account, or using their Microsoft account, or using their Github account

Step 2: Browse Listings:

- User is navigated to the home page post successful login
- User can browse through the listings by filtering by category, or by searching for a keyword, or selecting part of the donut graph representing the number of listings in each category
- User can click on a listing to view more details about the listing
- Listing details will include images of the item, the item's description, the item's price, the seller's name, ways to contact the seller, and a way to pay the seller, which can be done by clicking on the "Pay" button which will redirect them to Stripe's secure payment page to complete the payment. (Currently in test mode, so no actual payment will be made and no email receipts will be sent after a successful payment, use the test card number 4242 4242 4242 4242 to test the payment flow and phone number: 00000000000 and 000000 for the mobile verification code)

**Note:** Option for the 'Pay' button in a listing (secure payment to seller through Stripe) will only be available if seller has created a Payment Method with our platform (seller can create/update their payment method under their profile page)

Step 3: Create a Listing:

- User can view their profile by clicking on the "Profile" button on the top right corner of the page which will include their name, email, and a list of their listings, also a button to create a new listing and update their payment information to accept payments from buyers. Note a buyer cannot pay a seller without the seller's payment information.
- User can create a new listing by clicking on the "Create Listing" button on the top right corner of the page, in which you are required to fill out all the information and need to provide a minimum of 1 image of the item you are selling. You can also provide a description of the item you are selling, and a price for the item you are selling. On provision of all fields above the description and price fields, you will receive a suggestion for the description field which is produced by OpenAI.
