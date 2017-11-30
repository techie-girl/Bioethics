# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.utils import timezone
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .models import Case, Category


from django.http import HttpResponse

from . models import Case
def index(request):
    all_cases = Case.objects.filter(published_date__lte=timezone.now())
    unpublished = Case.objects.filter(published_date__isnull=True)
    case_group = []
    case_groups = []
    counter = 0

    for case in all_cases :

        case_group.append(case)
        counter += 1
        if len(case_group) == 3 :
                case_groups.append(case_group)
                case_group = []

    if len(case_group) != 3 :
            case_groups.append(case_group)

    context = {
        'case_groups' : case_groups,
        'unpublished' : unpublished,
    }

    return render(request,'case/case_list.html' , context)


def detail(request, case_id):
		return HttpResponse("<h1>Details for case id:" + str(case_id) + "</h2>")


def create(request) :
    try :
        filename = request.POST["filename"]
        html = request.POST["html"]
        # html = "<br />".join(html.split("\n"))
        # path = request.POST["path"]
        # published_date = request.POST["published_date"]
        # Construct an object.
        case = Case(title=filename,
                    html = html)
                # path = path,
                # published_date = case.publish(),
                # user = request.user)
        # Save the object to the database.
        case.save()
        # return redirect("case:detail", pk=case.id)
        return HttpResponse(filename)
    except KeyError:
        # No post parameters
        return HttpResponse("Nothing to see here... TODO: Add 404.")

def case_view(request, pk) :
        case = get_object_or_404(Case, pk=pk)
        context = {"case" :case}
        return HttpResponse(case.html)

@login_required
def case_edit(request, pk) :

    case = get_object_or_404(Case, pk=pk)

    try:
        case.title=request.POST["title"]
        case.description=request.POST["description"]
        category_pk = request.POST["category"]
        category = get_object_or_404(Category, pk=category_pk)
        case.category = category
        case.published_date = timezone.now()
        case.save()
        return redirect("case:index")

    except KeyError:
        categories = Category.objects.all()
        context = {
                "case" :case,
                "categories" : categories
        }
        return render(request, "case/case_edit.html", context)


@login_required
def case_delete(request, pk) :

    case = get_object_or_404(Case, pk=pk)
    case.delete()
    return redirect("case:index")



# Authentication methods
def login_user(request) :
    try :
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None :
            login(request, user)
            return redirect("case:index")
        else :
            return redirect("login")
    except KeyError :
        return render(request, 'case/login.html')

def logout_user(request) :
    logout(request)
    return redirect("/")
