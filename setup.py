#!/usr/bin/env python

from setuptools import setup


def get_requirements(suffix=''):
    with open('requirements%s.txt' % suffix) as f:
        rv = [line for line in f.read().splitlines() if 'github' not in line]
    return rv


setup(
    name='map-world-news',
    version='3.0',
    author='',
    author_email='',
    description='',
    include_package_data=True,
    zip_safe=False,
    packages=['app'],
    install_requires=get_requirements())
