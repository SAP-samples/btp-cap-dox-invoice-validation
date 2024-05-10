Tiny python service that creates a PDF out of the edited positions.

First, feeds the data that represents the edited positions into a _jinja2_ html template. Then, the _weasyprint_ lib takes care of converting the rendered html template into the final PDF.

## Setup

Uses Python version 3.11

Install packages

```
pip install -r requirements.txt
```

Start web server

```
uvicorn server:app --reload --port 4005
```
