from django.urls import path
from . import views
urlpatterns=[path("",views.home,name="home"),path("api/compare/",views.compare_paths,name="compare_paths")]
