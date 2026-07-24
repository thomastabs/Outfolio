# Tech Stack

Next.js + FastAPI + PostgreSQL + Redis + Celery

Building on the baseline stack, this option adds Redis and Celery for background job processing and caching to support timer jobs, AI-assisted generation, and other asynchronous tasks. This enhances scalability and responsiveness for compute-intensive or delayed operations while maintaining the core stack for simplicity.

- Pros:
  - Supports asynchronous background processing
  - Improves performance for AI and timer-based features
  - Retains modern, fast backend framework
- Cons:
  - Increased infrastructure complexity
  - Requires operational expertise for Redis and Celery
  - Slightly longer development and deployment time

## Architecture Principles

<!-- Document the core architectural decisions and constraints for this project. -->