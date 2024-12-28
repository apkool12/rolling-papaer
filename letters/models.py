from django.db import models

class Letter(models.Model):
    author = models.CharField(max_length=100)
    content = models.TextField()
    recipient = models.CharField(max_length=100)
    is_anonymous = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True) 

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Letter from {self.author} to {self.recipient}"