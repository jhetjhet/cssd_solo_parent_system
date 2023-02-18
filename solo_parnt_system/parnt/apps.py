from django.apps import AppConfig


class ParntConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'parnt'

    def ready(self) -> None:

        from . import signals

        return super().ready()