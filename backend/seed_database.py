#!/usr/bin/env python3
"""
Simple script to seed database from backend directory
Run: python seed_database.py
"""

from database.seed_data import seed_database

if __name__ == "__main__":
    seed_database()
