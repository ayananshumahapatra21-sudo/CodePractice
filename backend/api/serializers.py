from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import Problem, Submission, UserProgress, UserProfile, Badge

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'code', 'title', 'description', 'icon', 'category']


class UserProfileSerializer(serializers.ModelSerializer):
    unlocked_badges = BadgeSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'xp', 'level', 'streak', 'daily_challenge_completed', 'unlocked_badges']


class ProblemListSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Problem
        fields = [
            'id', 'problem_number', 'title', 'slug', 'difficulty',
            'category', 'status', 'is_ai_generated', 'created_at'
        ]

    def get_status(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            progress = UserProgress.objects.filter(user=request.user, problem=obj).first()
            return progress.status if progress else 'Unsolved'
        return 'Unsolved'


class ProblemDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = '__all__'


class AdminProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = '__all__'


class SubmissionSerializer(serializers.ModelSerializer):
    problem_title = serializers.CharField(source='problem.title', read_only=True)
    problem_slug = serializers.CharField(source='problem.slug', read_only=True)

    class Meta:
        model = Submission
        fields = [
            'id', 'problem', 'problem_title', 'problem_slug', 'language',
            'code', 'status', 'execution_time', 'memory', 'test_cases_passed',
            'total_test_cases', 'error_message', 'created_at'
        ]


class RunCodeSerializer(serializers.Serializer):
    problem_id = serializers.IntegerField()
    language = serializers.CharField()
    code = serializers.CharField()
    custom_input = serializers.CharField(required=False, allow_blank=True)


class SubmitCodeSerializer(serializers.Serializer):
    problem_id = serializers.IntegerField()
    language = serializers.CharField()
    code = serializers.CharField()


class AIHintRequestSerializer(serializers.Serializer):
    problem_id = serializers.IntegerField()
    current_hint_level = serializers.IntegerField(default=1)


class AIExplainRequestSerializer(serializers.Serializer):
    problem_id = serializers.IntegerField()
    code = serializers.CharField()
    language = serializers.CharField(default='python')


class AIDebugRequestSerializer(serializers.Serializer):
    problem_id = serializers.IntegerField()
    code = serializers.CharField()
    error_message = serializers.CharField(required=False, allow_blank=True)
    language = serializers.CharField(default='python')


class AILearnRequestSerializer(serializers.Serializer):
    topic = serializers.CharField()
    question = serializers.CharField(required=False, allow_blank=True)
    problem_title = serializers.CharField(required=False, allow_blank=True)


class AIGenerateProblemRequestSerializer(serializers.Serializer):
    topic = serializers.CharField(default='Arrays')
    difficulty = serializers.CharField(default='Easy')
    language = serializers.CharField(default='python')
    concept = serializers.CharField(default='Two Pointer')
