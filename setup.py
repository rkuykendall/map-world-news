#!/usr/bin/env python

from setuptools import setup


def get_requirements(suffix=''):
    with open('requirements%s.txt' % suffix) as f:
        rv = f.read().splitlines()
    return rv


setup(
    name='iris',
    version='1.1',
    author='',
    author_email='',
    description='',
    include_package_data=True,
    zip_safe=False,
    packages=['iris'],
    install_requires=get_requirements())
