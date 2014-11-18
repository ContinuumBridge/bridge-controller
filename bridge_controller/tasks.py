
from celery import task
from django.utils.importlib import import_module

@task()
def broadcast(model, verb):
    print "broadcast task is", verb
    model.broadcast(verb)

'''
@task()
def save(model):
    print "in save task"
    resource = import_module(model.default_resource)
    print "model.default_resource is", model.default_resource
    print "resource  is", resource

    #return x + y

@task()
def delete(model):
    return x + y
'''
