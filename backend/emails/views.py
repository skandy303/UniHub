from django.shortcuts import render
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response

class EmailView(APIView):
    def get(self, request):
        try:
            print(
                send_mail(
                    "something",
                    "this is the body",
                    "s.vecham@mail.utoronto.ca",
                    ["skandan.vecham@hotmail.com"],
                    return_path=True,
                )
            )
        except Exception as e:
            print(e.message)
        return Response({"details": "worked"}, status=200)