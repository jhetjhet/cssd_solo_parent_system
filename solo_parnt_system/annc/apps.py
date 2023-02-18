from django.apps import AppConfig


class AnncConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'annc'

    def ready(self) -> None:

        from . import signals

        return super().ready()