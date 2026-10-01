import { ExerciseGuide } from '../types';

export const EXERCISE_DATABASE: ExerciseGuide[] = [
  // =========================================================================
  // 1. [PAPS 핵심 공식 종목] (PAPS Core Curriculum Items)
  // =========================================================================
  {
    id: 'paps-shuttle-run',
    name: '왕복오래달리기 (20m 셔틀런)',
    category: 'cardio',
    subType: 'paps_official',
    targetPaps: '심폐지구력 (PAPS 대표종목)',
    difficulty: '중급',
    targetMuscles: ['심폐순환계', '대퇴사두근', '비복근', '전신 지구력'],
    description: '20m 구간을 음원에 맞춰 점점 빨라지는 신호음에 따라 왕복하여 달리는 PAPS 핵심 심폐지구력 평가 종목입니다.',
    safetyNotes: [
      '시작 전 발목 관절, 아킬레스건, 무릎 스트레칭을 3분 이상 충분히 실시합니다.',
      '턴 지점에서 급제동할 때 무릎이 뒤틀리지 않도록 무게중심을 낮추고 발끝으로 바닥을 강하게 지지합니다.',
      '호흡 곤란이나 어지럼증 발생 시 무리하지 않고 천천히 걸으며 심박수를 안정시킵니다.'
    ],
    steps: [
      '출발선 뒤에 서서 신호음("삐-")이 울리면 맞은편 20m 선을 향해 출발합니다.',
      '다음 신호음이 울리기 전에 반대편 선에 한 발 이상 도달해야 하며, 신호음이 울리면 즉시 반대 방향으로 달립니다.',
      '음원 레벨이 올라갈수록 속도가 빨라지므로 초반에 무리하게 전력 질주하지 않고 일정한 페이스를 유지합니다.'
    ],
    recommendedRepsOrTime: '남학생 70~80회 이상(1급) / 여학생 45~55회 이상(1급)',
    mode: 'counter',
    defaultGoal: 60,
    unit: '회',
    iconName: 'Zap',
    guideAnimationType: 'shuttle-run',
    calorieBurnPerMin: 12,
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['초반 페이스 안배', '2박자 리듬 호흡 (흡-흡-후-후)', '낮은 무게중심 턴 동작'],
    checkpoints: [
      { title: '올바른 턴', desc: '발끝을 턴 라인에 정확히 디디고 몸통을 180도 부드럽게 회전합니다.', isWarning: false },
      { title: '호흡 유지', desc: '코로 2번 들이마시고 입으로 2번 내쉬는 리듬을 잃지 않습니다.', isWarning: false },
      { title: '주의사항', desc: '신호음 전에 미리 출발하거나 라인을 밟지 않고 도는 것은 파울입니다.', isWarning: true }
    ]
  },
  {
    id: 'curl-up',
    name: '윗몸말아올리기 (Curl-Up)',
    category: 'strength',
    subType: 'paps_official',
    bodyPart: 'abs',
    targetPaps: '근력/근지구력 (PAPS 복근 종목)',
    difficulty: '초급',
    targetMuscles: ['복직근', '복사근', '복횡근', '코어'],
    description: '허리에 무리를 주지 않고 3초 메트로놈 신호(올라가기-유지-내려가기)에 맞춰 복부의 힘으로 상체를 30도 들어 올리는 안전한 체력 종목입니다.',
    safetyNotes: [
      '목을 억지로 꺾어 당기지 말고 턱을 살짝 당긴 상태로 시선은 대각선 천장을 향합니다.',
      '허리가 바닥에서 과도하게 뜨지 않도록 배꼽을 척추 쪽으로 당겨 복압을 유지합니다.',
      '반동을 사용하지 않고 오직 복부의 수축과 이완으로만 동작을 수행합니다.'
    ],
    steps: [
      '무릎을 약 90도로 굽히고 등을 바닥에 대고 편안하게 눕습니다.',
      '양손을 허벅지 위 또는 바닥에 둔 뒤 손가락 끝이 10~11cm 전진할 때까지 상체를 들어 올립니다.',
      '메트로놈 소리에 맞춰 3초 동안 1회를 완료하며 천천히 시작 자세로 복귀합니다.'
    ],
    recommendedRepsOrTime: '남학생 60~70회(1급) / 여학생 40~50회(1급)',
    mode: 'counter',
    defaultGoal: 40,
    unit: '회',
    iconName: 'Activity',
    guideAnimationType: 'curl-up',
    calorieBurnPerMin: 6,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['3초 메트로놈 리듬 준수', '상체 30도 롤업', '손끝 10cm 전진'],
    checkpoints: [
      { title: '상체 상승 각도', desc: '견갑골(날개뼈)이 바닥에서 완전히 떨어질 때까지 말아 올립니다.', isWarning: false },
      { title: '목 긴장 완화', desc: '턱 밑에 테니스공 하나가 들어갈 공간을 유지합니다.', isWarning: false },
      { title: '반동 금지', desc: '팔을 휘두르거나 엉덩이를 튕기며 올라오면 기록이 인정되지 않습니다.', isWarning: true }
    ]
  },
  {
    id: 'paps-sit-and-reach',
    name: '앉아윗몸앞으로굽히기 (좌전굴)',
    category: 'flexibility',
    subType: 'paps_official',
    targetPaps: '유연성 (PAPS 유연성 종목)',
    difficulty: '초급',
    targetMuscles: ['햄스트링', '척추기립근', '둔근', '종아리'],
    description: 'PAPS 공식 측정기구에 앉아 무릎을 굽히지 않고 상체를 숙여 손끝을 최대한 멀리 밀어내는 유연성 검사 종목입니다.',
    safetyNotes: [
      '반동을 심하게 주면 햄스트링 근육이 손상될 수 있으므로 천천히 숨을 내쉬며 밉니다.',
      '무릎이 위로 굽혀지지 않도록 측정판에 다리를 곧게 밀착시킵니다.'
    ],
    steps: [
      '신발을 벗고 측정계의 수직면에 양 발바닥을 완전히 밀착시킨 후 곧게 앉습니다.',
      '양손을 펴서 손바닥을 아래로 향하게 하고 양손 중지를 나란히 모읍니다.',
      '숨을 천천히 내쉬며 상체를 앞으로 숙여 측정판 눈금자를 부드럽게 2초간 밉니다.'
    ],
    recommendedRepsOrTime: '남학생 20cm 이상(1급) / 여학생 22cm 이상(1급)',
    mode: 'timer',
    defaultGoal: 60,
    unit: '초',
    iconName: 'Compass',
    guideAnimationType: 'stretch',
    calorieBurnPerMin: 3,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['무릎 굽힘 방지', '호흡 날숨 유지', '손끝 2초 정지'],
    checkpoints: [
      { title: '자세 유지', desc: '최대 신전 지점에서 2초 동안 멈춘 눈금을 측정합니다.', isWarning: false },
      { title: '반동 금지', desc: '순간적인 튕김 반동으로 민 거리는 무효 처리됩니다.', isWarning: true }
    ]
  },

  // =========================================================================
  // 2. [치닝디핑 기구 활용 운동] (Chinning & Dipping Station Workouts)
  // =========================================================================
  {
    id: 'chinning-pullup',
    name: '치닝디핑 풀업 & 친업 (턱걸이)',
    category: 'chinningdipping',
    subType: 'chinning_dipping',
    bodyPart: 'back',
    targetPaps: '근력/근지구력 (상체 당기는 힘 & 악력)',
    difficulty: '고급',
    targetMuscles: ['광배근', '대원근', '상완이두근', '능형근', '전완근'],
    description: '치닝디핑 기구의 상단 바를 잡고 체중을 수직으로 끌어올리는 최고의 상체 등 근력 운동입니다. 오버그립(풀업)은 등 너비를, 언더그립(친업)은 등 안쪽과 이두근을 집중 발달시킵니다.',
    safetyNotes: [
      '올라갈 때 어깨가 으쓱 올라가지 않도록 날개뼈를 아래로 눌러(후인하강) 고정합니다.',
      '반동을 과도하게 주면 어깨 관절 부상 위험이 있으니 엄격한 자세로 수행합니다.',
      '내려올 때 팔꿈치를 갑자기 툭 떨어뜨리지 않고 통제하며 천천히 이완합니다.'
    ],
    steps: [
      '치닝 바를 어깨너비보다 넓게 오버그립(손바닥이 앞을 봄) 또는 어깨너비 언더그립으로 잡습니다.',
      '매달린 상태에서 가슴을 살짝 천장을 향해 열고 날개뼈를 조여 어깨를 안정화합니다.',
      '팔꿈치를 옆구리 쪽으로 강하게 내리찍는 느낌으로 턱이나 쇄골이 바에 닿을 때까지 몸을 당겨 올립니다.',
      '최고점에서 1초 정지 후 광배근의 긴장을 유지하며 천천히 시작 자세로 내려옵니다.'
    ],
    recommendedRepsOrTime: '5~12회 x 3~4세트 (초보자는 버티기부터 시작)',
    mode: 'counter',
    defaultGoal: 8,
    unit: '회',
    iconName: 'Activity',
    guideAnimationType: 'pull',
    calorieBurnPerMin: 9,
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['가슴 바를 향해 열기', '팔꿈치 수직 수축', '완전 신전과 수축'],
    checkpoints: [
      { title: '견갑 후인하강', desc: '출발 전 날개뼈를 아래로 꽉 잡고 시작합니다.', isWarning: false },
      { title: '반동 최소화', desc: '하체를 흔들지 않고 코어에 힘을 주어 흔들림을 통제합니다.', isWarning: false }
    ]
  },
  {
    id: 'chinning-dips',
    name: '치닝디핑 평행봉 딥스 (Dips)',
    category: 'chinningdipping',
    subType: 'chinning_dipping',
    bodyPart: 'chest',
    targetPaps: '근력/근지구력 (가슴 하부 & 삼두근 밀기)',
    difficulty: '고급',
    targetMuscles: ['대흉근 하부', '상완삼두근', '전면삼각근', '코어'],
    description: '기구 중앙의 딥스 바를 잡고 상체를 지탱한 뒤 팔꿈치를 굽혀 내려갔다 밀어 올리는 고강도 상체 프레스 운동입니다.',
    safetyNotes: [
      '어깨 유연성이 부족한 경우 팔꿈치 각도가 90도보다 더 깊게 내려가지 않도록 주의합니다.',
      '손목이 뒤로 꺾이지 않도록 딥스 바를 손바닥 하단(수근골)으로 꽉 눌러 잡습니다.'
    ],
    steps: [
      '딥스 손잡이를 잡고 점프하여 팔을 곧게 펴 몸을 공중에 띄웁니다.',
      '상체를 15~20도 앞으로 기울여 가슴 근육에 긴장을 유도합니다.',
      '팔꿈치를 뒤로 보내며 팔이 90도가 될 때까지 천천히 몸을 낮춥니다.',
      '가슴과 삼두근의 힘으로 바닥을 밀어내듯 바를 강하게 밀어 시작 자세로 복귀합니다.'
    ],
    recommendedRepsOrTime: '8~15회 x 3세트',
    mode: 'counter',
    defaultGoal: 10,
    unit: '회',
    iconName: 'Shield',
    guideAnimationType: 'push-up',
    calorieBurnPerMin: 8,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['상체 앞 기울임(가슴 자극)', '팔꿈치 90도 제어', '어깨 거상 방지'],
    checkpoints: [
      { title: '과도한 딥 금지', desc: '어깨 관절에 찌르는 통증이 느껴지면 깊이를 줄입니다.', isWarning: true }
    ]
  },
  {
    id: 'chinning-hanging-leg-raise',
    name: '치닝디핑 행잉 레그레이즈 & 니레이즈',
    category: 'chinningdipping',
    subType: 'chinning_dipping',
    bodyPart: 'abs',
    targetPaps: '근력/근지구력 (하복부 & 코어 수축력)',
    difficulty: '중급',
    targetMuscles: ['하복직근', '장요근', '전완근', '복횡근'],
    description: '치닝디핑 기구의 등받이 암패드나 상단 철봉에 매달려 다리를 들어 올리는 최고 난이도의 하복부 고립 운동입니다.',
    safetyNotes: [
      '상체가 앞뒤로 그네처럼 흔들리지 않도록 복압을 단단히 유지합니다.',
      '초보자는 무릎을 접어 가슴 쪽으로 당기는 행잉 니레이즈부터 단계적으로 수행합니다.'
    ],
    steps: [
      '치닝디핑 기구의 패드에 전완을 거치하거나 철봉에 곧게 매달립니다.',
      '숨을 내쉬며 골반을 앞으로 말아 올리는 느낌으로 다리를 90도 수평 이상 들어 올립니다.',
      '하복부의 강한 수축을 1초간 느끼고 천천히 다리를 내려 저항을 버팁니다.'
    ],
    recommendedRepsOrTime: '12~18회 x 3세트',
    mode: 'counter',
    defaultGoal: 15,
    unit: '회',
    iconName: 'Zap',
    guideAnimationType: 'curl-up',
    calorieBurnPerMin: 7,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['골반 말아 올리기', '반동 통제', '하복부 최대 수축'],
    checkpoints: [
      { title: '허리 꺾임 방지', desc: '다리를 내릴 때 요추가 과신전되지 않도록 제어합니다.', isWarning: false }
    ]
  },
  {
    id: 'chinning-negative-hold',
    name: '치닝디핑 친업 네거티브 & 버티기',
    category: 'chinningdipping',
    subType: 'chinning_dipping',
    bodyPart: 'back',
    targetPaps: '근력 (턱걸이 0개 탈출 기초 근력)',
    difficulty: '초급',
    targetMuscles: ['광배근', '상완이두근', '악력', '견갑안정근'],
    description: '턱걸이를 1개도 하기 힘든 학생들을 위한 훈련으로, 점프하여 턱이 바 위에 올라간 최고점에서 5초 동안 천천히 버티며 내려오는 편심성 근력 강화 운동입니다.',
    safetyNotes: [
      '착지 시 발받침대에 안전하게 발이 닿도록 주변 환경을 확인합니다.',
      '버티는 동안 숨을 참지 않고 균일하게 내쉽니다.'
    ],
    steps: [
      '치닝디핑 기구 하단 발판을 밟고 점프하여 턱이 바 위로 올라간 수축 자세를 만듭니다.',
      '가슴을 펴고 광배근에 힘을 준 채로 5초 동안 카운트하며 천천히 내려옵니다.',
      '바닥에 발이 닿으면 다시 점프하여 1회를 반복합니다.'
    ],
    recommendedRepsOrTime: '5초 버티기 x 5회 (3세트)',
    mode: 'timer',
    defaultGoal: 30,
    unit: '초',
    iconName: 'Timer',
    guideAnimationType: 'pull',
    calorieBurnPerMin: 6,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['5초간 통제된 하강', '등 근육 긴장 지속', '어깨 귀 멀어지기'],
    checkpoints: [
      { title: '갑작스러운 추락 방지', desc: '힘이 빠지더라도 끝까지 버티며 내려옵니다.', isWarning: false }
    ]
  },
  {
    id: 'chinning-inverted-row',
    name: '치닝디핑 바 인버티드 로우 (Inverted Row)',
    category: 'chinningdipping',
    subType: 'chinning_dipping',
    bodyPart: 'back',
    targetPaps: '근력/근지구력 (등 중부 & 날개뼈 교정)',
    difficulty: '초급',
    targetMuscles: ['능형근', '승모근 중·하부', '후면삼각근', '광배근'],
    description: '기구의 중간 손잡이나 딥스 바 아래에 누워 몸을 45도 각도로 기울인 채 가슴을 바 쪽으로 당기는 수평 당기기 운동입니다. 굽은 등 교정에 탁월합니다.',
    safetyNotes: [
      '발뒤꿈치로 지면을 지지하고 엉덩이가 아래로 처지지 않도록 둔근을 조입니다.'
    ],
    steps: [
      '바 아래에 위치하여 양손으로 손잡이를 어깨너비로 잡고 다리를 앞으로 뻗어 몸을 기울입니다.',
      '몸을 머리부터 발끝까지 널빤지처럼 곧게 폅니다.',
      '가슴 중앙이 손잡이에 닿을 때까지 견갑골을 모으며 당깁니다.',
      '등 근육의 이완을 느끼며 천천히 시작 자세로 돌아옵니다.'
    ],
    recommendedRepsOrTime: '12~15회 x 3세트',
    mode: 'counter',
    defaultGoal: 12,
    unit: '회',
    iconName: 'Award',
    guideAnimationType: 'pull',
    calorieBurnPerMin: 6,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['견갑골 조이기', '몸통 일직선 유지', '가슴 터치'],
    checkpoints: [
      { title: '어깨 수평', desc: '당길 때 어깨가 솟아오르지 않게 쇄골을 넓게 폅니다.', isWarning: false }
    ]
  },

  // =========================================================================
  // 3. [캐틀벨 활용 운동] (Kettlebell Conditioning & Power Workouts)
  // =========================================================================
  {
    id: 'kettlebell-two-hand-swing',
    name: '캐틀벨 투핸드 스윙 (Kettlebell Swing)',
    category: 'kettlebell',
    subType: 'kettlebell',
    bodyPart: 'legs',
    targetPaps: '순발력 & 심폐지구력 (후면사슬 힙힌지 파워)',
    difficulty: '중급',
    targetMuscles: ['대둔근', '햄스트링', '척추기립근', '복횡근', '심폐순환계'],
    description: '팔로 드는 것이 아닌, 고관절 힌지(Hip Hinge)와 엉덩이의 폭발적인 수축 파워로 캐틀벨을 가슴 높이까지 띄우는 전신 폭발력 운동입니다.',
    safetyNotes: [
      '무릎을 굽히는 스쿼트가 아니라 엉덩이를 뒤로 빼는 힌지 동작이어야 합니다.',
      '허리가 둥글게 말리면 요추 부상 위험이 있으므로 항상 척추를 곧게 폅니다.',
      '정점에서 허리를 뒤로 과도하게 젖히지 말고 복근과 엉덩이를 단단히 쪼입니다.'
    ],
    steps: [
      '캐틀벨을 발 앞 30cm에 두고 어깨너비보다 살짝 넓게 선 뒤 엉덩이를 뒤로 빼며 양손으로 손잡이를 잡습니다.',
      '캐틀벨을 가랑이 사이로 하이킹하듯 당겼다가, 엉덩이를 강하게 앞으로 튕겨내며 일어섭니다.',
      '반동으로 캐틀벨이 가슴 높이까지 떠오르면 무중력 상태를 1초 느끼고 다시 자연스럽게 떨어지는 궤적을 힌지로 받아냅니다.'
    ],
    recommendedRepsOrTime: '20회 x 3~4세트 (또는 45초 인터벌)',
    mode: 'counter',
    defaultGoal: 20,
    unit: '회',
    iconName: 'Flame',
    guideAnimationType: 'jump',
    calorieBurnPerMin: 14,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['힙 힌지 메커니즘', '엉덩이 락아웃', '팔은 줄 역할만 수행'],
    checkpoints: [
      { title: '무릎 각도', desc: '무릎은 정강이가 수직에 가깝게 최소한으로만 굽힙니다.', isWarning: false },
      { title: '허리 중립', desc: '스윙 중 시선은 전방 3~4m 바닥을 향하며 목과 척추를 정렬합니다.', isWarning: false }
    ]
  },
  {
    id: 'kettlebell-goblet-squat',
    name: '캐틀벨 고블렛 스쿼트 (Goblet Squat)',
    category: 'kettlebell',
    subType: 'kettlebell',
    bodyPart: 'legs',
    targetPaps: '근력/근지구력 (하체 전면 & 코어 수직 지지력)',
    difficulty: '초급',
    targetMuscles: ['대퇴사두근', '대둔근', '코어', '상부 등'],
    description: '캐틀벨을 양손으로 가슴 앞에 성배(Goblet)처럼 쥐고 깊게 앉았다 일어나는 스쿼트로, 상체 세움과 골반 가동성 향상에 가장 이상적인 하체 운동입니다.',
    safetyNotes: [
      '발뒤꿈치가 바닥에서 뜨지 않도록 체중을 발바닥 중앙과 뒤꿈치에 고루 분산합니다.',
      '무릎이 안쪽으로 모이지 않도록 발끝 방향(약 30도 외회전)과 일치시킵니다.'
    ],
    steps: [
      '캐틀벨의 뿔(혼)을 양손으로 감싸 쥐고 가슴 중앙에 밀착시킵니다.',
      '숨을 들이마시며 복압을 채우고, 팔꿈치가 양 무릎 안쪽을 살짝 스칠 때까지 깊게 앉습니다.',
      '발바닥 전체로 지면을 강하게 밀어내며 호흡을 내쉬며 일어섭니다.'
    ],
    recommendedRepsOrTime: '15회 x 3세트',
    mode: 'counter',
    defaultGoal: 15,
    unit: '회',
    iconName: 'Dumbbell',
    guideAnimationType: 'squat',
    calorieBurnPerMin: 8,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['가슴 앞 무게 유지', '상체 꼿꼿이 세우기', '완전한 깊이(풀 스쿼트)'],
    checkpoints: [
      { title: '팔꿈치 가이드', desc: '팔꿈치가 무릎 안쪽을 터치하며 골반 가동범위를 자연스럽게 넓힙니다.', isWarning: false }
    ]
  },
  {
    id: 'kettlebell-single-arm-row',
    name: '캐틀벨 원암 벤트오버 로우 (Single Arm Row)',
    category: 'kettlebell',
    subType: 'kettlebell',
    bodyPart: 'back',
    targetPaps: '근력/근지구력 (광배근 편측 발달 & 상체 균형)',
    difficulty: '중급',
    targetMuscles: ['광배근', '능형근', '후면삼각근', '코어 안정근'],
    description: '한 손에 캐틀벨을 쥐고 힌지 자세에서 팔꿈치를 옆구리 뒤쪽으로 당겨 올려 좌우 불균형을 해소하고 두꺼운 등 근육을 만듭니다.',
    safetyNotes: [
      '골반이 한쪽으로 비틀어지지 않도록 코어에 힘을 주고 몸통 수평을 유지합니다.'
    ],
    steps: [
      '한 발을 뒤로 빼고 앞쪽 무릎을 살짝 굽혀 상체를 45도 숙입니다.',
      '반대쪽 손은 앞 허벅지에 가볍게 얹어 상체를 지지하고 캐틀벨을 잡습니다.',
      '팔꿈치를 골반 쪽을 향해 사선 뒤로 당겨 올려 등 근육을 꽉 조입니다.',
      '광배근의 이완을 느끼며 천천히 시작 자세로 내립니다.'
    ],
    recommendedRepsOrTime: '좌우 각 12회 x 3세트',
    mode: 'counter',
    defaultGoal: 12,
    unit: '회',
    iconName: 'Shield',
    guideAnimationType: 'pull',
    calorieBurnPerMin: 7,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['팔꿈치 골반 쪽 궤적', '견갑 수축', '몸통 회전 제어'],
    checkpoints: [
      { title: '어깨 하강', desc: '당길 때 귀와 어깨가 가까워지지 않도록 유지합니다.', isWarning: false }
    ]
  },
  {
    id: 'kettlebell-clean-and-press',
    name: '캐틀벨 클린 앤 오버헤드 프레스',
    category: 'kettlebell',
    subType: 'kettlebell',
    bodyPart: 'shoulder',
    targetPaps: '근력 & 순발력 (어깨 삼각근 & 상하체 파워 전이)',
    difficulty: '고급',
    targetMuscles: ['전면/측면 삼각근', '승모근', '삼두근', '둔근', '코어'],
    description: '캐틀벨을 바닥에서 가슴 앞 랙(Rack) 포지션으로 부드럽게 끌어올린 후, 머리 위로 힘차게 밀어 올리는 복합 파워 트레이닝입니다.',
    safetyNotes: [
      '클린 동작 시 캐틀벨이 손목을 강하게 때리지 않도록 손잡이를 부드럽게 감아 쥡니다.',
      '프레스 시 허리가 뒤로 과도하게 젖혀지지 않도록 복근을 단단히 조입니다.'
    ],
    steps: [
      '가랑이 사이에서 스윙 반동으로 캐틀벨을 가슴 앞 어깨선 랙 포지션으로 클린합니다.',
      '코어와 둔근에 힘을 주고, 수직 궤적을 그리며 캐틀벨을 머리 위로 곧게 프레스합니다.',
      '팔꿈치를 완전히 펴 정점에서 1초 정지한 뒤 통제하며 랙 포지션으로 내립니다.'
    ],
    recommendedRepsOrTime: '좌우 각 8~10회 x 3세트',
    mode: 'counter',
    defaultGoal: 8,
    unit: '회',
    iconName: 'Zap',
    guideAnimationType: 'push-up',
    calorieBurnPerMin: 10,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['부드러운 랙 포지션 전환', '수직 프레스 궤적', '코어 브레이싱'],
    checkpoints: [
      { title: '손목 중립', desc: '손목이 꺾이지 않도록 너클이 천장을 향하게 지지합니다.', isWarning: false }
    ]
  },
  {
    id: 'kettlebell-russian-twist',
    name: '캐틀벨 시티드 러시안 트위스트',
    category: 'kettlebell',
    subType: 'kettlebell',
    bodyPart: 'abs',
    targetPaps: '근력/근지구력 (복사근 회전 안정성 & 단단한 코어)',
    difficulty: '중급',
    targetMuscles: ['내/외복사근', '복직근', '복횡근'],
    description: '바닥에 앉아 상체를 뒤로 45도 젖힌 채 캐틀벨의 무게 저항을 이겨내며 상체를 좌우로 회전하는 강력한 복부 코어 운동입니다.',
    safetyNotes: [
      '허리가 둥글게 무너지지 않도록 가슴을 활짝 펴고 척추를 세웁니다.',
      '캐틀벨을 바닥에 세게 내려놓지 않고 부드럽게 방향을 전환합니다.'
    ],
    steps: [
      '바닥에 앉아 무릎을 구부리고 발뒤꿈치를 바닥에 댑니다(숙련자는 발을 띄웁니다).',
      '캐틀벨 손잡이를 양손으로 쥐고 가슴 앞에 둡니다.',
      '상체를 좌측으로 회전하여 캐틀벨을 엉덩이 옆 바닥에 살짝 터치 후, 곧바로 우측으로 회전합니다.'
    ],
    recommendedRepsOrTime: '좌우 왕복 20회 x 3세트',
    mode: 'counter',
    defaultGoal: 20,
    unit: '회',
    iconName: 'Activity',
    guideAnimationType: 'curl-up',
    calorieBurnPerMin: 7,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['몸통 전체 회전', '45도 기울임 유지', '일정한 템포'],
    checkpoints: [
      { title: '가슴 정렬', desc: '손만 돌리지 않고 흉추 전체를 좌우로 회전시킵니다.', isWarning: false }
    ]
  },
  {
    id: 'kettlebell-romanian-deadlift',
    name: '캐틀벨 루마니안 데드리프트 (RDL)',
    category: 'kettlebell',
    subType: 'kettlebell',
    bodyPart: 'legs',
    targetPaps: '근력 & 유연성 (후면사슬 햄스트링·기립근 강화)',
    difficulty: '초급',
    targetMuscles: ['햄스트링', '대둔근', '척추기립근', '광배근'],
    description: '캐틀벨을 쥐고 엉덩이를 뒤로 밀어내며 햄스트링의 팽팽한 이완을 유도한 뒤 수축하는 대표적인 후면 체인 강화 훈련입니다.',
    safetyNotes: [
      '등이 구부러지지 않도록 가슴을 펴고 어깨를 뒤로 고정합니다.',
      '무릎은 살짝만 굽힌 상태로 고정하고 고관절만 접습니다.'
    ],
    steps: [
      '양발을 골반너비로 벌리고 캐틀벨을 양손으로 쥐고 곧게 섭니다.',
      '엉덩이를 벽 쪽으로 밀어내며 정강이 앞을 스치듯 캐틀벨을 무릎 아래까지 천천히 내립니다.',
      '햄스트링이 최대로 늘어나는 지점에서 1초 멈춘 뒤 둔근을 강하게 조이며 일어섭니다.'
    ],
    recommendedRepsOrTime: '15회 x 3세트',
    mode: 'counter',
    defaultGoal: 15,
    unit: '회',
    iconName: 'Award',
    guideAnimationType: 'squat',
    calorieBurnPerMin: 7,
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['힙 힌지 집중', '정강이 수직 유지', '햄스트링 텐션'],
    checkpoints: [
      { title: '바닥 밀착', desc: '발가락과 뒤꿈치가 뜨지 않고 바닥을 움켜쥐듯 지지합니다.', isWarning: false }
    ]
  },

  // =========================================================================
  // 4. [맨몸 근력운동 5대 부위: 등·어깨·가슴·복근·하체]
  // =========================================================================

  // --- [맨몸 등 운동 (Back)] ---
  {
    id: 'bodyweight-superman-w-row',
    name: '슈퍼맨 W-로우 & 백 익스텐션',
    category: 'strength',
    subType: 'bodyweight_back',
    bodyPart: 'back',
    targetPaps: '근력/근지구력 (척추기립근·광배근·굽은등 교정)',
    difficulty: '초급',
    targetMuscles: ['척추기립근', '광배근', '능형근', '둔근'],
    description: '바닥에 엎드린 상태에서 상체와 하체를 동시에 들어 올리며 팔꿈치를 W자로 강하게 당겨 등의 모든 근육을 수축시키는 최고의 맨몸 등 운동입니다.',
    safetyNotes: [
      '목을 과도하게 뒤로 꺾지 말고 시선은 바닥 30cm 앞을 유지합니다.',
      '허리에 찌릿한 통증이 발생하면 들어 올리는 높이를 조절합니다.'
    ],
    steps: [
      '바닥에 엎드려 양팔을 앞으로 뻗고 다리를 곧게 모읍니다.',
      '상체와 다리를 바닥에서 15~20cm 들어 올림과 동시에 팔꿈치를 옆구리 쪽으로 W자 모양으로 강하게 당깁니다.',
      '날개뼈 사이에 연필을 끼우듯 조인 채 2초간 정지 후 천천히 시작 자세로 돌아옵니다.'
    ],
    recommendedRepsOrTime: '15~20회 x 3세트',
    mode: 'counter',
    defaultGoal: 15,
    unit: '회',
    iconName: 'Activity',
    guideAnimationType: 'pull',
    calorieBurnPerMin: 6,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['W자 팔꿈치 궤적', '날개뼈 강한 압축', '2초 수축 유지'],
    checkpoints: [
      { title: '견갑 조임', desc: '상체만 들지 말고 날개뼈를 뒤아래로 확실히 모아줍니다.', isWarning: false }
    ]
  },
  {
    id: 'bodyweight-prone-cobra',
    name: '프론 코브라 & 견갑골 리트랙션',
    category: 'strength',
    subType: 'bodyweight_back',
    bodyPart: 'back',
    targetPaps: '유연성 & 근력 (상부 등 정렬 & 거북목 체형 교정)',
    difficulty: '초급',
    targetMuscles: ['승모근 하부', '능형근', '회전근개(외회전근)', '후면삼각근'],
    description: '엎드린 채 엄지손가락을 천장으로 돌리며 상체를 들어 올려 날개뼈를 아래로 모으는 교정 트레이닝입니다.',
    safetyNotes: [
      '턱을 당겨 이중턱을 만드는 느낌으로 목 정렬을 유지합니다.'
    ],
    steps: [
      '바닥에 엎드려 팔을 양옆 골반 옆에 두고 손바닥이 바닥을 보게 합니다.',
      '엄지손가락을 천장 방향으로 외회전하며 상체를 10cm 들어 올립니다.',
      '날개뼈를 아래쪽으로 끌어내리며 20~30초간 호흡을 유지하며 버팁니다.'
    ],
    recommendedRepsOrTime: '30초 홀드 x 3세트',
    mode: 'timer',
    defaultGoal: 30,
    unit: '초',
    iconName: 'Compass',
    guideAnimationType: 'stretch',
    calorieBurnPerMin: 4,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['엄지 천장 외회전', '날개뼈 하강 조임', '30초 지속 유지'],
    checkpoints: [
      { title: '목 긴장 해소', desc: '승모근 상부로 으쓱하지 않고 날개뼈 아래쪽에 힘을 줍니다.', isWarning: false }
    ]
  },

  // --- [맨몸 어깨 운동 (Shoulder)] ---
  {
    id: 'bodyweight-pike-pushup',
    name: '파이크 푸쉬업 (Pike Push-Up)',
    category: 'strength',
    subType: 'bodyweight_shoulder',
    bodyPart: 'shoulder',
    targetPaps: '근력/근지구력 (어깨 전면/측면 삼각근 & 수직 프레스)',
    difficulty: '중급',
    targetMuscles: ['전면삼각근', '측면삼각근', '상완삼두근', '상부 승모근'],
    description: '엉덩이를 높이 들어 ㅅ(시옷)자 모양을 만든 뒤, 머리를 손 앞 대각선 바닥으로 내렸다가 어깨 힘으로 밀어 올리는 맨몸 수직 프레스 운동입니다.',
    safetyNotes: [
      '손목 유연성이 부족한 경우 손가락을 약간 바깥쪽으로 돌려 바닥을 짚습니다.',
      '정수리가 손 사이가 아닌 앞쪽 삼각지점에 닿도록 사선으로 내려갑니다.'
    ],
    steps: [
      '엎드린 하이 플랭크 자세에서 발을 손 쪽으로 걸어와 엉덩이를 천장으로 높이 솟구치게 합니다.',
      '팔꿈치를 45도 각도로 접으며 정수리가 양손 앞 꼭짓점에 닿을 듯 천천히 내려갑니다.',
      '손바닥 전체로 바닥을 강하게 밀어내며 엉덩이를 원래 높이로 복귀합니다.'
    ],
    recommendedRepsOrTime: '10~15회 x 3세트',
    mode: 'counter',
    defaultGoal: 10,
    unit: '회',
    iconName: 'Shield',
    guideAnimationType: 'push-up',
    calorieBurnPerMin: 8,
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['ㅅ자 몸통 형태 유지', '삼각 꼭짓점 머리 하강', '어깨 힘으로 밀기'],
    checkpoints: [
      { title: '수직 궤적', desc: '엉덩이가 앞으로 무너지지 않도록 높이를 엄격히 유지합니다.', isWarning: false }
    ]
  },
  {
    id: 'bodyweight-shoulder-ytw',
    name: '맨몸 암 서클 & Y-T-W 숄더 레이즈',
    category: 'strength',
    subType: 'bodyweight_shoulder',
    bodyPart: 'shoulder',
    targetPaps: '유연성 & 근지구력 (어깨 3개두 & 회전근개 부상 예방)',
    difficulty: '초급',
    targetMuscles: ['전면/측면/후면 삼각근', '극하근', '견갑하근', '회전근개'],
    description: '상체를 살짝 숙인 상태에서 팔로 Y, T, W 형태를 연속으로 만들며 어깨의 전·측·후면 3개두와 회전근개를 종합 강화하는 루틴입니다.',
    safetyNotes: [
      '반동을 쓰지 않고 천천히 어깨 근육의 긴장만으로 팔을 들어 올립니다.'
    ],
    steps: [
      '골반을 뒤로 빼 상체를 30도 숙이고 양팔을 자연스럽게 늘어뜨립니다.',
      '1단계: 엄지를 세워 머리 위 Y자로 10회 들어 올리기 (전면/상부)',
      '2단계: 양옆으로 T자로 10회 들어 올리기 (측면/후면)',
      '3단계: 팔꿈치를 구부려 W자로 10회 모으기 (후면/견갑)',
      '쉬지 않고 연속 수행합니다.'
    ],
    recommendedRepsOrTime: 'Y-T-W 각 10회 (총 30회 3세트)',
    mode: 'counter',
    defaultGoal: 30,
    unit: '회',
    iconName: 'Compass',
    guideAnimationType: 'stretch',
    calorieBurnPerMin: 5,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['엄지손가락 방향 집중', '견갑골 컨트롤', '어깨 버닝 감각'],
    checkpoints: [
      { title: '일정한 호흡', desc: '동작 중 숨을 참지 않고 부드럽게 호흡합니다.', isWarning: false }
    ]
  },

  // --- [맨몸 가슴 운동 (Chest)] ---
  {
    id: 'bodyweight-diamond-pushup',
    name: '다이아몬드 푸쉬업 (Diamond Push-Up)',
    category: 'strength',
    subType: 'bodyweight_chest',
    bodyPart: 'chest',
    targetPaps: '근력/근지구력 (가슴 안쪽 내측두 & 삼두근 분리)',
    difficulty: '고급',
    targetMuscles: ['대흉근 내측', '상완삼두근', '전면삼각근'],
    description: '양손 엄지와 검지를 모아 다이아몬드(삼각형) 모양을 만들어 수행하는 푸쉬업으로, 가슴 안쪽 골과 삼두근에 초고강도 자극을 전달합니다.',
    safetyNotes: [
      '손목 부담이 있으므로 시작 전 손목 관절을 충분히 풀어줍니다.',
      '통증 시 양손 간격을 약간 벌려 진행합니다.'
    ],
    steps: [
      '양손 엄지와 검지를 맞대어 가슴 정중앙 바로 아래 바닥에 둡니다.',
      '팔꿈치를 옆구리에 가깝게 유지하며 가슴 중앙이 손등에 스칠 때까지 내려갑니다.',
      '삼두근과 가슴 안쪽의 힘으로 지면을 강하게 밀어 시작 자세로 복귀합니다.'
    ],
    recommendedRepsOrTime: '10~15회 x 3세트',
    mode: 'counter',
    defaultGoal: 10,
    unit: '회',
    iconName: 'Award',
    guideAnimationType: 'push-up',
    calorieBurnPerMin: 8,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['다이아몬드 손모양', '팔꿈치 몸통 밀착', '가슴 안쪽 강한 수축'],
    checkpoints: [
      { title: '가동범위', desc: '손등에 가슴이 가볍게 닿을 때까지 내려갑니다.', isWarning: false }
    ]
  },
  {
    id: 'bodyweight-decline-pushup',
    name: '디클라인 푸쉬업 (상부 가슴 집중)',
    category: 'strength',
    subType: 'bodyweight_chest',
    bodyPart: 'chest',
    targetPaps: '근력 (대흉근 쇄골두·가슴 윗부분 볼륨)',
    difficulty: '중급',
    targetMuscles: ['대흉근 상부(쇄골두)', '전면삼각근', '상완삼두근'],
    description: '양발을 의자, 벤치, 또는 계단 위에 올려두고 수행하는 푸쉬업으로, 상체 윗부분과 어깨에 체중이 집중되어 상부 가슴을 탄탄하게 만듭니다.',
    safetyNotes: [
      '발이 미끄러지지 않는 견고한 지지대를 사용합니다.',
      '머리로 피가 쏠릴 수 있으므로 세트 간 충분히 호흡을 정리합니다.'
    ],
    steps: [
      '발끝을 30~50cm 높이의 벤치에 올리고 양손을 바닥에 어깨너비로 짚습니다.',
      '몸통을 수직 대각선으로 단단히 고정하고 팔꿈치를 굽혀 이마가 바닥에 가까워질 때까지 내려갑니다.',
      '상부 가슴의 힘으로 바닥을 밀어 올립니다.'
    ],
    recommendedRepsOrTime: '12~15회 x 3세트',
    mode: 'counter',
    defaultGoal: 12,
    unit: '회',
    iconName: 'Zap',
    guideAnimationType: 'push-up',
    calorieBurnPerMin: 8,
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['발 높이 조절', '상부 가슴 궤적', '코어 조임'],
    checkpoints: [
      { title: '허리 처짐 방지', desc: '발이 높은 만큼 허리가 아래로 꺾이기 쉬우니 복압을 유지합니다.', isWarning: false }
    ]
  },

  // --- [맨몸 복근 운동 (Abs / Core)] ---
  {
    id: 'bodyweight-hollow-body-hold',
    name: '할로우 바디 홀드 & 버티기 (체조식 코어)',
    category: 'strength',
    subType: 'bodyweight_abs',
    bodyPart: 'abs',
    targetPaps: '근력/근지구력 (PAPS 복근 1급 필수 전신 복압)',
    difficulty: '중급',
    targetMuscles: ['복직근 전체', '복횡근', '장요근', '골반기저근'],
    description: '바나나 모양으로 몸통을 말아 요추(허리)를 바닥에 완벽히 밀착시킨 채 버티는 기계체조의 기본 복근 훈련입니다.',
    safetyNotes: [
      '허리와 바닥 사이에 손가락 하나라도 들어갈 틈이 생기면 다리를 더 높여 허리를 바닥에 붙입니다.'
    ],
    steps: [
      '등을 대고 누워 양팔을 귀 옆 머리 위로 뻗고 양다리를 곧게 폅니다.',
      '배꼽을 척추 쪽으로 강하게 누르며 날개뼈와 다리를 바닥에서 15cm 들어 올립니다.',
      '허리가 바닥에서 절대 뜨지 않도록 유지하며 목표 시간 동안 흔들림 없이 버팁니다.'
    ],
    recommendedRepsOrTime: '30~45초 유지 x 3세트',
    mode: 'timer',
    defaultGoal: 30,
    unit: '초',
    iconName: 'Timer',
    guideAnimationType: 'plank',
    calorieBurnPerMin: 6,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['요추 바닥 완전 밀착', '발끝 포인', '균일한 복압 호흡'],
    checkpoints: [
      { title: '허리 들림 주의', desc: '허리가 뜨면 복근 대신 요추 관절에 무리가 가므로 주의합니다.', isWarning: true }
    ]
  },
  {
    id: 'bodyweight-bicycle-crunch',
    name: '바이시클 크런치 (Bicycle Crunch)',
    category: 'strength',
    subType: 'bodyweight_abs',
    bodyPart: 'abs',
    targetPaps: '근력/근지구력 (내·외복사근 & 상하복부 교차 수축)',
    difficulty: '중급',
    targetMuscles: ['외복사근', '내복사근', '상·하복직근', '장요근'],
    description: '누워서 자전거 페달을 밟듯 다리를 교차하고 반대쪽 팔꿈치를 무릎에 교대로 터치하여 복부 전체를 360도로 쥐어짜는 최고의 복근 운동입니다.',
    safetyNotes: [
      '손으로 목을 꺾어 당기지 말고 귀 뒤에 손끝을 가볍게 얹습니다.'
    ],
    steps: [
      '바닥에 누워 양손을 귀 뒤에 대고 다리를 90도로 들어 올립니다.',
      '오른쪽 무릎을 가슴으로 당김과 동시에 상체를 비틀어 왼쪽 팔꿈치를 무릎에 터치합니다.',
      '반대쪽 다리는 앞으로 45도 곧게 뻗어줍니다.',
      '좌우를 리듬감 있게 교차하며 반복합니다.'
    ],
    recommendedRepsOrTime: '좌우 1회 기준 20~30회 x 3세트',
    mode: 'counter',
    defaultGoal: 20,
    unit: '회',
    iconName: 'Activity',
    guideAnimationType: 'curl-up',
    calorieBurnPerMin: 8,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['가슴통 전체 회전', '뻗는 다리 45도 유지', '복사근 완전 수축'],
    checkpoints: [
      { title: '템포 유지', desc: '너무 빠르게 튕기지 않고 수축 지점에서 1초간 멈춥니다.', isWarning: false }
    ]
  },
  {
    id: 'bodyweight-leg-raise-reverse',
    name: '레그레이즈 & 리버스 크런치',
    category: 'strength',
    subType: 'bodyweight_abs',
    bodyPart: 'abs',
    targetPaps: '근력/근지구력 (하복부 고립 & 아랫배 근육 발달)',
    difficulty: '초급',
    targetMuscles: ['하복직근', '장요근', '복횡근'],
    description: '골반을 말아 올리며 다리를 수직으로 들어 올려 아랫배 근육을 집중적으로 단련하는 맨몸 하복부 기본 운동입니다.',
    safetyNotes: [
      '다리를 내릴 때 허리가 활처럼 휘어지지 않는 높이까지만 내립니다.'
    ],
    steps: [
      '바닥에 등을 대고 누워 양손을 엉덩이 옆 또는 엉덩이 아래에 둡니다.',
      '무릎을 편 상태로 복부 힘으로 다리를 90도까지 들어 올린 뒤, 골반을 바닥에서 5cm 살짝 더 들어 올립니다.',
      '하복부 긴장을 유지하며 바닥 5cm 전까지 다리를 천천히 내립니다.'
    ],
    recommendedRepsOrTime: '15~20회 x 3세트',
    mode: 'counter',
    defaultGoal: 15,
    unit: '회',
    iconName: 'Zap',
    guideAnimationType: 'curl-up',
    calorieBurnPerMin: 6,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['골반 살짝 들어 올리기', '천천히 네거티브 이완', '허리 바닥 밀착'],
    checkpoints: [
      { title: '반동 최소화', desc: '다리를 위로 던지지 않고 복부 힘으로만 제어합니다.', isWarning: false }
    ]
  },
  {
    id: 'bodyweight-plank-shoulder-tap',
    name: '플랭크 숄더 탭 & 마운틴 클라이머',
    category: 'strength',
    subType: 'bodyweight_abs',
    bodyPart: 'abs',
    targetPaps: '코어 안정성 (회전 저항 안티로테이션 & 전신 체력)',
    difficulty: '중급',
    targetMuscles: ['복횡근', '복직근', '어깨 안정근', '전신 코어'],
    description: '하이 플랭크 자세에서 골반을 흔들리지 않게 고정한 채 한 손으로 반대쪽 어깨를 번갈아 터치하고 무릎을 당겨 코어 제어력을 극대화합니다.',
    safetyNotes: [
      '골반이 좌우로 뒤뚱거리지 않도록 양발을 어깨너비로 벌려 지지 기반을 넓힙니다.'
    ],
    steps: [
      '손바닥을 어깨 아래에 두고 곧은 하이 플랭크 자세를 취합니다.',
      '몸통과 골반을 고정한 채 오른손을 들어 왼쪽 어깨를 톡 터치하고 내려놓습니다.',
      '이어서 왼손으로 오른쪽 어깨를 터치하며, 20회 터치 후 곧바로 마운틴 클라이머 20회를 이어갑니다.'
    ],
    recommendedRepsOrTime: '숄더 탭 20회 + 클라이머 20회 (3세트)',
    mode: 'counter',
    defaultGoal: 20,
    unit: '회',
    iconName: 'Shield',
    guideAnimationType: 'climber',
    calorieBurnPerMin: 10,
    imageUrl: 'https://images.unsplash.com/photo-1434596922112-19c563067271?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['골반 수평 고정', '발넓이 지지', '정교한 안티로테이션'],
    checkpoints: [
      { title: '엉덩이 높이', desc: '엉덩이가 위로 치솟거나 밑으로 꺼지지 않게 수평을 유지합니다.', isWarning: false }
    ]
  },

  // --- [맨몸 하체 운동 (Lower Body)] ---
  {
    id: 'bodyweight-air-squat',
    name: '바디웨이트 에어 스쿼트 (Air Squat)',
    category: 'strength',
    subType: 'bodyweight_legs',
    bodyPart: 'legs',
    targetPaps: '근력/근지구력 (하체 기본기 & 대퇴사두근·대둔근)',
    difficulty: '초급',
    targetMuscles: ['대퇴사두근', '대둔근', '햄스트링', '종아리'],
    description: '맨몸으로 자신의 체중만을 이용해 엉덩이를 깊게 낮추었다가 일어나는 하체의 가장 기본적이고 필수적인 운동입니다.',
    safetyNotes: [
      '무릎이 발끝 방향과 다르게 안쪽으로 모이지 않도록 무릎을 바깥으로 열어줍니다.',
      '허리가 말리지 않도록 가슴을 펴고 시선은 정면을 봅니다.'
    ],
    steps: [
      '양발을 어깨너비로 벌리고 발끝을 15~20도 바깥으로 엽니다.',
      '엉덩이를 의자에 앉듯 뒤로 빼며 허벅지가 바닥과 평행이 될 때까지 깊게 앉습니다.',
      '발뒤꿈치로 지면을 강하게 밀어내며 엉덩이를 조이며 일어섭니다.'
    ],
    recommendedRepsOrTime: '20~30회 x 3세트',
    mode: 'counter',
    defaultGoal: 20,
    unit: '회',
    iconName: 'Dumbbell',
    guideAnimationType: 'squat',
    calorieBurnPerMin: 7,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['발뒤꿈치 체중 지지', '무릎 바깥 외회전', '풀 가동범위'],
    checkpoints: [
      { title: '가슴 세우기', desc: '상체가 바닥으로 고꾸라지지 않도록 가슴을 활짝 엽니다.', isWarning: false }
    ]
  },
  {
    id: 'bodyweight-walking-lunge',
    name: '워킹 & 리버스 런지 (Lunges)',
    category: 'strength',
    subType: 'bodyweight_legs',
    bodyPart: 'legs',
    targetPaps: '근력 & 밸런스 (단일 다리 둔근 파워 & 고관절 안정성)',
    difficulty: '중급',
    targetMuscles: ['대둔근', '대퇴사두근', '햄스트링', '중둔근', '코어'],
    description: '한 발을 앞 또는 뒤로 크게 딛어 양 무릎이 90도가 되도록 앉았다가 일어나는 편측 하체 밸런스 운동입니다.',
    safetyNotes: [
      '앞무릎이 발끝보다 너무 앞으로 튀어나가지 않도록 수직에 가깝게 내립니다.',
      '골반이 좌우로 기우뚱하지 않도록 정면을 유지합니다.'
    ],
    steps: [
      '차렷 자세에서 한쪽 다리를 앞으로 80~100cm 크게 내딛습니다.',
      '앞쪽 무릎과 뒤쪽 무릎이 각각 90도가 되도록 수직으로 몸을 낮춥니다.',
      '앞발 뒤꿈치를 강하게 밀어내며 제자리로 돌아옵니다.'
    ],
    recommendedRepsOrTime: '좌우 왕복 각 15회 x 3세트',
    mode: 'counter',
    defaultGoal: 20,
    unit: '회',
    iconName: 'Activity',
    guideAnimationType: 'jump',
    calorieBurnPerMin: 8,
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['무릎 90도 정렬', '상체 수직 세움', '앞뒤꿈치 추진력'],
    checkpoints: [
      { title: '뒷무릎 바닥 가볍게 스치기', desc: '뒷무릎이 바닥에 쿵 찧지 않게 제어합니다.', isWarning: false }
    ]
  },
  {
    id: 'bodyweight-bulgarian-split-squat',
    name: '불가리안 스플릿 스쿼트 (Bulgarian Split Squat)',
    category: 'strength',
    subType: 'bodyweight_legs',
    bodyPart: 'legs',
    targetPaps: '근력 (단일 다리 둔근·대퇴사두 초고강도 발달)',
    difficulty: '고급',
    targetMuscles: ['대둔근', '대퇴사두근', '중둔근', '고관절 굴곡근'],
    description: '한쪽 발등을 뒤쪽 의자나 벤치에 올려두고 앞다리 하나만으로 체중을 온전히 지탱하며 앉는 고난도 편측 하체 운동입니다.',
    safetyNotes: [
      '앞발의 위치가 너무 가까우면 무릎에 부담이 가므로 편안하게 90도가 나오는 거리를 찾습니다.'
    ],
    steps: [
      '의자나 벤치를 등지고 서서 한쪽 발등을 벤치 위에 얹습니다.',
      '앞발로 체중의 80%를 지탱하며 엉덩이를 대각선 뒤로 낮추듯 깊게 앉습니다.',
      '앞발 뒤꿈치를 지면으로 강하게 짓누르며 둔근의 힘으로 일어섭니다.'
    ],
    recommendedRepsOrTime: '좌우 각 10~12회 x 3세트',
    mode: 'counter',
    defaultGoal: 10,
    unit: '회',
    iconName: 'Award',
    guideAnimationType: 'squat',
    calorieBurnPerMin: 9,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['앞발 체중 집중', '둔근 신장성 수축', '상체 살짝 앞 기울임'],
    checkpoints: [
      { title: '무릎 흔들림 방지', desc: '앞무릎이 안쪽으로 돌아가지 않도록 단단히 고정합니다.', isWarning: false }
    ]
  },
  {
    id: 'bodyweight-calf-raise-rdl',
    name: '스탠딩 카프 레이즈 & 싱글레그 RDL',
    category: 'strength',
    subType: 'bodyweight_legs',
    bodyPart: 'legs',
    targetPaps: '순발력 & 유연성 (종아리 비복근·발목 탄성·후면사슬)',
    difficulty: '초급',
    targetMuscles: ['비복근(종아리)', '가자미근', '발목 안정근', '햄스트링'],
    description: '발뒤꿈치를 최대한 높이 들어 올려 종아리 근육을 쥐어짜고, 한 발로 서서 힙 힌지를 수행하여 달리기와 점프에 필수적인 발목 탄성을 강화합니다.',
    safetyNotes: [
      '내려올 때 발뒤꿈치가 쿵 떨어지지 않고 지면 직전까지 천천히 버팁니다.'
    ],
    steps: [
      '벽을 가볍게 짚고 양발을 골반너비로 선 뒤 발가락 앞꿈치로만 지면을 누르며 뒤꿈치를 최고 높이로 들어 올립니다.',
      '종아리 꼭대기에서 2초간 강하게 쥐어짜고 천천히 내려옵니다.',
      '이어서 한 발로 지탱하며 상체를 숙이고 반대 다리를 뒤로 뻗는 싱글레그 힌지를 연결합니다.'
    ],
    recommendedRepsOrTime: '카프레이즈 25회 + 힌지 10회 (3세트)',
    mode: 'counter',
    defaultGoal: 25,
    unit: '회',
    iconName: 'Zap',
    guideAnimationType: 'jump',
    calorieBurnPerMin: 5,
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['뒤꿈치 최대 거상', '2초 수축 정지', '발목 관절 안정화'],
    checkpoints: [
      { title: '엄지발가락 지지', desc: '새끼발가락 쪽으로 무게가 새지 않도록 엄지발가락 관절로 강하게 밉니다.', isWarning: false }
    ]
  },

  // =========================================================================
  // 5. [심폐지구력 러닝 훈련] (Running Training: Intervals & Buildup)
  // =========================================================================
  {
    id: 'running-gps-tracker',
    name: '실시간 야외/트랙 러닝 (GPS 트래커 연동)',
    category: 'running',
    subType: 'running_drill',
    targetPaps: '심폐지구력 (실시간 거리·페이스·GPS 경로 기록)',
    difficulty: '초급',
    targetMuscles: ['심폐순환계', '하지 전신 근육군', '전신 유산소'],
    description: '스마트폰/태블릿의 GPS 센서를 연동하여 야외 운동장 트랙이나 로드를 달리며 실시간 이동 거리(km), 1km당 페이스, 소모 칼로리, 누적 시간을 측정합니다.',
    safetyNotes: [
      '러닝 전 발목과 무릎 관절을 충분히 돌려주고 가볍게 3분간 워밍업 조깅을 합니다.',
      '도로 주행 시 차량이나 장애물에 주의하며 이어폰 볼륨을 낮춰 주변 소리를 인지합니다.'
    ],
    steps: [
      '운동 측정/카운터 탭에서 [실시간 러닝 GPS 모드]를 활성화하고 GPS 신호를 확인합니다.',
      '[러닝 시작] 버튼을 누른 후 일정한 보폭과 2박자 호흡(흡-흡-후-후)을 유지하며 달립니다.',
      '운동 완료 후 [러닝 종료 및 기록 저장]을 누르면 총 거리, 평균 페이스, 시간이 자동 저장됩니다.'
    ],
    recommendedRepsOrTime: '1.5km ~ 3km 완주 (주 2~3회)',
    mode: 'timer',
    defaultGoal: 1200,
    unit: '초',
    iconName: 'Timer',
    guideAnimationType: 'run',
    calorieBurnPerMin: 11,
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['GPS 실시간 위치 측정', '1km당 페이스(분/km) 관리', '미드풋 착지'],
    checkpoints: [
      { title: 'GPS 연결 확인', desc: '실외 트랙이나 탁 트인 곳에서 시작하면 GPS 정확도가 극대화됩니다.', isWarning: false }
    ]
  },
  {
    id: 'running-run-walk-protocol',
    name: '[초급] 런-워크 1:1 러닝 (20분 완성)',
    category: 'running',
    subType: 'running_drill',
    targetPaps: '심폐지구력 (러닝 기초 체력)',
    difficulty: '초급',
    targetMuscles: ['심폐순환계', '하지 전신 근육', '유산소 대사능력'],
    description: '달리기 초보자를 위한 가장 안전한 유산소 훈련으로, 1분 가벼운 조깅과 1분 빠른 걷기를 10회 반복하여 심폐지구력 기반을 만듭니다.',
    safetyNotes: [
      '조깅 구간에서 무리하게 전력 질주하지 않고 대화가 가능한 편안한 속도를 유지합니다.',
      '착지 시 쿵쿵 소리가 나지 않도록 미드풋으로 가볍게 착지합니다.'
    ],
    steps: [
      '워밍업 3분 가볍게 걷기 후 본 훈련을 시작합니다.',
      '[1분 조깅 (심박수 60~70%)] ➔ [1분 빠른 걷기 (호흡 정리)]를 1세트로 하여 총 10세트(20분) 진행합니다.',
      '쿨다운 스트레칭 2분으로 마무리합니다.'
    ],
    recommendedRepsOrTime: '20분 지속 훈련 (주 3회)',
    mode: 'timer',
    defaultGoal: 1200,
    unit: '초',
    iconName: 'Zap',
    guideAnimationType: 'run',
    calorieBurnPerMin: 10,
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['미드풋 착지', '1:1 시간 엄수', '코호흡과 입호흡의 조화'],
    checkpoints: [
      { title: '착지 소음', desc: '발소리가 크게 들리지 않도록 발목 힘을 빼고 가볍게 디딥니다.', isWarning: false }
    ]
  },
  {
    id: 'running-tempo-run-buildup',
    name: '[중급] 빌드업 템포런 (페이스 점진 가속 15분)',
    category: 'running',
    subType: 'running_drill',
    targetPaps: '심폐지구력 (셔틀런 고득점 페이스 적응)',
    difficulty: '중급',
    targetMuscles: ['심근 강화', '대퇴사두근', '둔근', '지구력 지근'],
    description: '5분 조깅으로 시작하여 매 5분마다 속도를 점진적으로 높여 심폐 한계를 부드럽게 확장시키는 체계적인 템포 훈련입니다.',
    safetyNotes: [
      '초반 5분에 오버페이스하지 않도록 속도계를 확인하거나 호흡을 통제합니다.'
    ],
    steps: [
      '0~5분: 가벼운 대화가 가능한 조깅 (워밍업)',
      '5~10분: 숨이 약간 차오르는 중강도 템포런',
      '10~15분: 셔틀런 후반부 속도에 맞먹는 빠른 지속 질주',
      '15분 후 3분간 가볍게 걸으며 쿨다운'
    ],
    recommendedRepsOrTime: '15분 빌드업 1세트',
    mode: 'timer',
    defaultGoal: 900,
    unit: '초',
    iconName: 'Timer',
    guideAnimationType: 'run',
    calorieBurnPerMin: 12,
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['단계별 명확한 페이스 상승', '일정한 피치(보폭 회전수)', '어깨 힘 빼기'],
    checkpoints: [
      { title: '호흡 리듬', desc: '속도가 빨라져도 2박자(흡흡-후후) 리듬을 유지합니다.', isWarning: false }
    ]
  },

  // =========================================================================
  // 6. [인터벌 훈련 가이드] (High Intensity & Interval Training Guides)
  // =========================================================================
  {
    id: 'interval-tabata-sprint',
    name: '타바타 4분 고강도 러닝 인터벌 (Tabata 20/10)',
    category: 'interval',
    subType: 'interval_drill',
    targetPaps: '심폐지구력 & 최대산소섭취량 (VO2max 극대화)',
    difficulty: '고급',
    targetMuscles: ['심폐순환계', '대퇴사두근', '둔근', '햄스트링', '전신 무산소'],
    description: '20초간 최고 속도로 전력 질주하고 10초간 가볍게 조깅/휴식하는 사이클을 8회(총 4분) 반복하여 짧은 시간 안에 심폐 한계를 뚫어주는 전설적인 타바타 프로토콜입니다.',
    safetyNotes: [
      '워밍업 없이 전력 질주하면 근육 경련이 발생할 수 있으므로 5분 이상 조깅 후 실시합니다.',
      '어지러움이나 가슴 답답함이 느껴지면 즉시 질주를 멈추고 걷습니다.'
    ],
    steps: [
      '워밍업 조깅 3분으로 체온을 올립니다.',
      '[20초 최고 속도 전력 질주 (심박수 90% 이상)] ➔ [10초 가벼운 걷기/조깅]을 1라운드로 설정합니다.',
      '총 8라운드(4분) 동안 쉬지 않고 몰아치며 마지막 8라운드까지 전력을 다합니다.',
      '훈련 후 3분 이상 천천히 걸으며 심박수를 안정시킵니다.'
    ],
    recommendedRepsOrTime: '20초 질주 + 10초 휴식 x 8라운드 (총 4분)',
    mode: 'timer',
    defaultGoal: 240,
    unit: '초',
    iconName: 'Flame',
    guideAnimationType: 'run',
    calorieBurnPerMin: 16,
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['20초 전력 질주 몰입', '10초 휴식 엄수', '4분 단기 완성'],
    checkpoints: [
      { title: '페이스 유지', desc: '초반 1~2라운드에만 전력하고 지치지 않도록 8라운드 전체를 완주합니다.', isWarning: false }
    ]
  },
  {
    id: 'interval-paps-shuttle-prep',
    name: '셔틀런 1등급 대비 15m/20m 가속 인터벌',
    category: 'interval',
    subType: 'interval_drill',
    targetPaps: '심폐지구력 (PAPS 왕복오래달리기 80회 돌파 훈련)',
    difficulty: '중급',
    targetMuscles: ['심폐지구력', '하체 턴 제동력', '지면반발력'],
    description: 'PAPS 셔틀런 턴 동작과 가속 능력을 집중 훈련하기 위해 20m 구간을 30초 동안 왕복 질주하고 15초간 제자리 호흡을 가다듬는 실전형 인터벌입니다.',
    safetyNotes: [
      '턴 지점에서 무릎이 뒤틀리지 않도록 낮은 자세로 방향을 전환합니다.'
    ],
    steps: [
      '20m 구간 양 끝에 마커를 설치합니다.',
      '30초 동안 신호음에 구애받지 않고 최대 왕복 횟수를 목표로 턴 질주합니다.',
      '15초간 제자리에서 깊은 심호흡으로 회복합니다.',
      '총 6~8세트 반복하여 셔틀런 후반부 심폐 피로도에 적응합니다.'
    ],
    recommendedRepsOrTime: '30초 질주 + 15초 회복 x 6세트',
    mode: 'timer',
    defaultGoal: 270,
    unit: '초',
    iconName: 'Zap',
    guideAnimationType: 'shuttle-run',
    calorieBurnPerMin: 13,
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['급감속 후 폭발적 재가속', '15초 정밀 회복', '셔틀런 실전 적응'],
    checkpoints: [
      { title: '턴 자세', desc: '몸통을 180도 부드럽게 낮추어 돌아 나옵니다.', isWarning: false }
    ]
  },
  {
    id: 'interval-pyramid-tempo',
    name: '피라미드 페이스 인터벌 (1분-2분-3분-2분-1분)',
    category: 'interval',
    subType: 'interval_drill',
    targetPaps: '심폐지구력 (페이스 조절력 & 젖산 내성 배양)',
    difficulty: '중급',
    targetMuscles: ['심근 강화', '대퇴사두근', '비복근', '호흡근'],
    description: '질주 시간을 1분 ➔ 2분 ➔ 3분으로 늘렸다가 다시 2분 ➔ 1분으로 줄여나가는 피라미드식 인터벌로, 달리기 페이스 조절과 젖산 분해 능력을 극대화합니다.',
    safetyNotes: [
      '3분 정점 구간에서 포기하지 않도록 1분, 2분 구간에서 지나친 오버페이스를 자제합니다.'
    ],
    steps: [
      '1단계: 1분 빠른 러닝 + 1분 조깅 회복',
      '2단계: 2분 템포 러닝 + 1분 30초 회복',
      '3단계(피크): 3분 고속 러닝 + 2분 회복',
      '4단계: 2분 템포 러닝 + 1분 30초 회복',
      '5단계: 1분 라스트 전력 질주 + 쿨다운 걷기'
    ],
    recommendedRepsOrTime: '총 16분 피라미드 루틴 1세트',
    mode: 'timer',
    defaultGoal: 960,
    unit: '초',
    iconName: 'Timer',
    guideAnimationType: 'run',
    calorieBurnPerMin: 12,
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['피라미드 정점 극복', '단계별 페이스 안배', '회복 시간 준수'],
    checkpoints: [
      { title: '심박 회복', desc: '회복 구간에서 멈추지 않고 가볍게 조깅하거나 걸어 혈류를 순환시킵니다.', isWarning: false }
    ]
  },
  {
    id: 'interval-bodyweight-hiit',
    name: '맨몸 전신 고강도 HIIT 서킷 인터벌 (버피·하이니·점핑)',
    category: 'interval',
    subType: 'interval_drill',
    targetPaps: '심폐지구력 & 전신 근지구력 (실내 공간 10분 완성)',
    difficulty: '고급',
    targetMuscles: ['전신 근육군', '심폐순환계', '복근', '하체 파워'],
    description: '도구 없이 좁은 실내에서도 폭발적인 심박수 상승을 유도하는 맨몸 전신 고강도 인터벌(HIIT)로, 버피테스트, 하이니(제자리 무릎차기), 마운틴 클라이머를 서킷으로 순환합니다.',
    safetyNotes: [
      '착지 시 앞꿈치부터 부드럽게 닿아 층간소음과 무릎 관절 충격을 방지합니다.'
    ],
    steps: [
      '1번: 버피테스트 40초 수행 ➔ 20초 휴식',
      '2번: 제자리 고속 하이니 40초 ➔ 20초 휴식',
      '3번: 마운틴 클라이머 40초 ➔ 20초 휴식',
      '4번: 점핑 에어 스쿼트 40초 ➔ 20초 휴식',
      '위 4개 종목을 1세트로 하여 2~3세트 반복합니다.'
    ],
    recommendedRepsOrTime: '40초 운동 + 20초 휴식 (4종목 x 2세트 총 8분)',
    mode: 'timer',
    defaultGoal: 480,
    unit: '초',
    iconName: 'Flame',
    guideAnimationType: 'jump',
    calorieBurnPerMin: 15,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['40초간 지치지 않는 템포', '전신 지방 연소', '폭발적인 심박 상승'],
    checkpoints: [
      { title: '자세 무너짐 주의', desc: '호흡이 가빠져도 허리가 꺾이지 않도록 코어를 고정합니다.', isWarning: true }
    ]
  },
  {
    id: 'interval-kettlebell-cardio',
    name: '캐틀벨 스윙 & 런 유산소 인터벌',
    category: 'interval',
    subType: 'interval_drill',
    targetPaps: '심폐 & 후면사슬 (폭발적 칼로리 소모 & 코어 파워)',
    difficulty: '중급',
    targetMuscles: ['둔근', '햄스트링', '심폐순환계', '광배근', '복근'],
    description: '캐틀벨 투핸드 스윙 30초와 제자리 가벼운 러닝 30초를 번갈아 수행하여 심폐와 둔근을 동시에 타격하는 하이브리드 인터벌입니다.',
    safetyNotes: [
      '스윙 시 척추가 말리지 않도록 힙 힌지를 정확히 유지합니다.'
    ],
    steps: [
      '캐틀벨 스윙 30초 연속 수행 (약 15~18회)',
      '캐틀벨을 안전하게 내려놓고 곧바로 제자리 가벼운 조깅 30초',
      '쉬는 시간 없이 연속 5세트(총 5분) 진행합니다.'
    ],
    recommendedRepsOrTime: '30초 스윙 + 30초 조깅 x 5세트 (총 5분)',
    mode: 'timer',
    defaultGoal: 300,
    unit: '초',
    iconName: 'Zap',
    guideAnimationType: 'jump',
    calorieBurnPerMin: 14,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['쉼 없는 5분 유산소 순환', '힙힌지 파워 유지', '리듬 호흡'],
    checkpoints: [
      { title: '캐틀벨 착지', desc: '세트 전환 시 캐틀벨을 던지지 않고 바닥에 안전하게 둡니다.', isWarning: false }
    ]
  },

  // =========================================================================
  // 7. [유연성 스트레칭] (Targeted Flexibility: Hip, Calf, Hamstring)
  // =========================================================================
  {
    id: 'stretch-hip-joint-pigeon',
    name: '대퇴관절 & 고관절 장요근 피죤 스트레칭',
    category: 'stretching',
    subType: 'flexibility_stretch',
    targetPaps: '유연성 (고관절 가동성 & 골반 정렬)',
    difficulty: '초급',
    targetMuscles: ['대퇴근막장근', '이상근', '장요근', '중둔근'],
    description: '오래 앉아 있어 굳어있는 고관절과 둔부 깊은 속근육을 풀어주어 달리기 보폭 확장 및 골반 가동성을 높입니다.',
    safetyNotes: [
      '무릎에 통증이 있을 경우 앞쪽 다리의 각도를 90도에서 45도로 좁혀서 진행합니다.'
    ],
    steps: [
      '엎드린 상태에서 한쪽 다리를 ㄱ자로 구부려 몸통 앞에 두고 반대쪽 다리는 뒤로 곧게 뻗습니다.',
      '양손으로 바닥을 짚고 척추를 곧게 세운 뒤 숨을 내쉬며 상체를 앞으로 천천히 숙입니다.',
      '엉덩이 바깥쪽과 고관절이 깊게 이완되는 것을 느끼며 30초간 머뭅니다.'
    ],
    recommendedRepsOrTime: '좌우 각 30초 x 3세트',
    mode: 'timer',
    defaultGoal: 60,
    unit: '초',
    iconName: 'Compass',
    guideAnimationType: 'stretch',
    calorieBurnPerMin: 3,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['골반 정면 유지', '깊은 날숨 호흡', '통증 없는 가동범위'],
    checkpoints: [
      { title: '골반 수평', desc: '엉덩이가 한쪽으로 기우뚱 무너지지 않도록 중심을 잡습니다.', isWarning: false }
    ]
  },
  {
    id: 'stretch-standing-hamstring',
    name: '스탠딩 햄스트링 & 종아리 비복근 스트레칭',
    category: 'stretching',
    subType: 'flexibility_stretch',
    targetPaps: '유연성 (PAPS 앉아윗몸앞으로굽히기 직접 기록 단축)',
    difficulty: '초급',
    targetMuscles: ['햄스트링 건', '비복근', '아킬레스건', '척추기립근'],
    description: '선 자세에서 한 발을 앞으로 내밀고 발끝을 당겨 허벅지 뒤쪽과 종아리를 동시에 늘려주는 PAPS 좌전굴 특화 스트레칭입니다.',
    safetyNotes: [
      '반동을 주지 않고 부드럽게 지그시 눌러줍니다.'
    ],
    steps: [
      '한쪽 다리를 앞으로 30cm 내밀고 발뒤꿈치만 닿게 하여 발끝을 몸 쪽으로 바짝 당깁니다.',
      '뒷다리 무릎을 살짝 굽히며 엉덩이를 뒤로 빼고, 양손으로 앞다리 정강이나 발끝을 향해 상체를 숙입니다.',
      '허벅지 뒤쪽과 종아리가 당겨지는 지점에서 20초간 호흡을 유지합니다.'
    ],
    recommendedRepsOrTime: '좌우 각 20초 x 3세트',
    mode: 'timer',
    defaultGoal: 40,
    unit: '초',
    iconName: 'Compass',
    guideAnimationType: 'stretch',
    calorieBurnPerMin: 3,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['발끝 몸쪽 당김', '등 펴고 상체 숙임', '20초 정적 스트레칭'],
    checkpoints: [
      { title: '척추 정렬', desc: '등만 구부리지 않고 골반을 앞으로 회전시켜 상체를 숙입니다.', isWarning: false }
    ]
  },

  // =========================================================================
  // 8. [순발력 플라이오메트릭] (Plyometrics for Explosive Power)
  // =========================================================================
  {
    id: 'plyo-power-tuck-jump',
    name: '파워 터크 점프 (Tuck Jump - 무릎 가슴 도약)',
    category: 'plyometrics',
    subType: 'plyometrics',
    targetPaps: '순발력 (순간 하지 폭발력 & 도약 탄성)',
    difficulty: '고급',
    targetMuscles: ['대퇴사두근', '둔근', '장요근', '복근', '종아리'],
    description: '수직으로 최고 높이 도약하여 공중에서 양 무릎을 가슴까지 순간적으로 끌어올리는 최고 난이도의 하지 폭발력 훈련입니다.',
    safetyNotes: [
      '착지 시 발바닥 전체로 부드럽게 무릎을 굽혀 착지 충격을 완충합니다.'
    ],
    steps: [
      '양발을 어깨너비로 벌리고 선 뒤 팔을 뒤로 젖히며 무릎을 살짝 굽힙니다.',
      '지면을 강하게 박차고 수직으로 솟구치며 공중에서 무릎을 가슴 높이까지 빠르게 당깁니다.',
      '손으로 무릎을 가볍게 터치하고 재빠르게 다리를 펴서 부드럽게 착지합니다.'
    ],
    recommendedRepsOrTime: '10회 도약 x 3세트',
    mode: 'counter',
    defaultGoal: 10,
    unit: '회',
    iconName: 'Flame',
    guideAnimationType: 'jump',
    calorieBurnPerMin: 12,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['수직 최고 도약', '무릎 가슴 순간 압축', '스프링 같은 연속 탄성'],
    checkpoints: [
      { title: '부드러운 착지', desc: '쿵 소리 없이 앞꿈치부터 닿으며 무릎을 굽힙니다.', isWarning: false }
    ]
  }
];
