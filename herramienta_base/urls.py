"""herramienta_base URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from EPE import views as v
from django.urls import  include
from django.conf.urls import url
from django.views.generic import TemplateView

urlpatterns = [
    path('', v.app),
    #url(r'^app', v.app),
    url(r'^buscador_index', v.index),
    url(r'^content', v.content),
    url(r'^recomendacion', v.recomendacion),
    url(r'^popup', v.popup),
    url(r'^acuerdo', v.acuerdo),
    url(r'^menu_opciones', v.menu_opciones),
    url(r'^loading', v.loading),
    url(r'^tarjeta', v.tarjeta),
    url(r'^services', v.servicios),
    url(r'^loadjobs', v.loadjobs),
    url(r'^myjobs', v.myjobs),
    url(r'^tarjeta_guardada', v.tarjeta_guardada),
    url(r'^buscador', v.buscador),
    url(r'^people', v.people),
    url(r'^test_epayco', v.test_epayco),
    url(r'^index', v.index),
    url(r'^activacion', v.activacion),
    url(r'^verificacion', v.verificacion),
    url(r'^admin', v.admin),
    url(r'^data', v.data),
    url(r'^profile', v.profile),
    url(r'^login', v.login),
    url(r'^health', v.health),
    url(r'^reclutamiento', v.reclutamiento),
    url(r'^EPE', include('EPE.urls'))

]
