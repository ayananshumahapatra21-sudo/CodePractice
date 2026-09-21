from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import Problem, Submission, UserProgress

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'date_joined')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class ProblemListSerializer(serializers.ModelSerializer):
    solved_status = serializers.SerializerMethodField()

    class Meta:
        model = Problem
        fields = ('id', 'problem_number', 'title', 'slug', 'difficulty', 'category', 'solved_status')

    def get_solved_status(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            progress = UserProgress.objects.filter(user=request.user, problem=obj).first()
            if progress:
                return progress.status
        return 'Unsolved'


class ProblemDetailSerializer(serializers.ModelSerializer):
    solved_status = serializers.SerializerMethodField()

    class Meta:
        model = Problem
        fields = (
            'id', 'problem_number', 'title', 'slug', 'difficulty', 'category',
            'description', 'examples', 'constraints', 'starter_code',
            'test_cases', 'solved_status'
        )

    def get_solved_status(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            progress = UserProgress.objects.filter(user=request.user, problem=obj).first()
            if progress:
                return progress.status
        return 'Unsolved'


class SubmissionSerializer(serializers.ModelSerializer):
    problem_title = serializers.CharField(source='problem.title', read_only=True)
    problem_number = serializers.IntegerField(source='problem.problem_number', read_only=True)
    difficulty = serializers.CharField(source='problem.difficulty', read_only=True)

    class Meta:
        model = Submission
        fields = (
            'id', 'problem', 'problem_number', 'problem_title', 'difficulty',
            'language', 'code', 'status', 'execution_time', 'memory',
            'test_cases_passed', 'total_test_cases', 'error_message', 'created_at'
        )


class RunCodeSerializer(serializers.Serializer):
    problem_id = serializers.IntegerField()
    language = serializers.CharField(max_length=20)
    code = serializers.CharField()


class SubmitCodeSerializer(serializers.Serializer):
    problem_id = serializers.IntegerField()
    language = serializers.CharField(max_length=20)
    code = serializers.CharField()
