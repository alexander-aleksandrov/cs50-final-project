from flask import redirect, render_template, session
from functools import wraps


def error(message, code=400):
    return render_template("error.html", message=message, code=code), code

def login_required(f):

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function




