#!/usr/bin/env python

from setuptools import setup
setup(
    name='iris',
    version='1.1',
    author='',
    author_email='',
    description='',
    include_package_data=True,
    zip_safe=False,
    packages=['iris'],
    install_requires=[
        'Flask==0.10.1',
        'Jinja2==2.7.2',
        'MarkupSafe==0.19',
        'Werkzeug==0.9.4',
        'gunicorn==18.0',
        'itsdangerous==0.24',
        'wsgiref==0.1.2',
        'Flask-SQLAlchemy==1.0',
        'nose==1.3.1',
        'SQLAlchemy==0.9.4',
        'dstk==0.50',
        'feedparser==5.1.3'
    ])
