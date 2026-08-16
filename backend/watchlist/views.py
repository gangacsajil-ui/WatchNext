from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Media
from .serializers import MediaSerializer, RegisterSerializer,LoginSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


class MediaViewSet(viewsets.ModelViewSet):
    serializer_class = MediaSerializer

    def get_queryset(self):
        return Media.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.create(user=user)

        return Response({
            'message': 'User created successfully',
            'token': token.key
        })

    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'message': 'Login successful',
            'token': token.key
        })

    return Response(serializer.errors, status=400)