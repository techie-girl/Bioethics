from django.conf.urls import url
from . import views

urlpatterns = [
    # ex: /case/
    url(r'^$', views.index, name='index'),

    # ex: /case/create/
    url(r'^create/$', views.create, name='create'),

    #ex: /case/<pk>/
    url(r'^(?P<pk>[0-9]+)/$', views.case_view, name='case_view'),

    #ex /case/<pk>/edit/
    url(r'^(?P<pk>[0-9]+)/edit$', views.case_edit, name='case_edit'),

    #ex /case/<pk>/edit/
    url(r'^(?P<pk>[0-9]+)/delete$', views.case_delete, name='case_delete'),
]
