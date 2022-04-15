from rest_framework import permissions


class InvolvedInAppointmentOrStaff(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser or request.user.is_staff:
            return True
        if obj.patient == request.user or obj.clinician == request.user:
            return True
        return False


class IsClinician(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.group == 'clinician':
            return True
        if request.user.is_staff or request.user.is_superuser:
            return True
        return False
