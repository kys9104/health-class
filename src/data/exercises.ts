import { ExerciseGuide } from '../types';

export const EXERCISE_DATABASE: ExerciseGuide[] = [
  // =========================================================================
  // 1. [e-PAPS 핵심 종목] (E-PAPS Core Curriculum Items)
  // =========================================================================
  {
    id: 'paps-shuttle-run',
    name: '왕복오래달리기 (20m 셔틀런)',
    category: 'cardio',
    subType: 'paps_official',
    targetPaps: '심폐지구력 (e-PAPS 대표종목)',
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
    targetPaps: '근력/근지구력 (e-PAPS 복근 종목)',
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
    id: 'push-up',
    name: '팔굽혀펴기 (Push-Up)',
    category: 'strength',
    subType: 'paps_official',
    targetPaps: '근력/근지구력 (e-PAPS 상체 종목)',
    difficulty: '중급',
    targetMuscles: ['대흉근', '삼두근', '전면삼각근', '코어'],
    description: '상체와 코어의 수평 균형을 유지하며 가슴과 팔의 힘으로 체중을 밀어 올리는 대표적인 상체 복합 운동입니다.',
    safetyNotes: [
      '엉덩이가 처지거나 위로 솟지 않도록 머리부터 발끝까지 일직선을 단단히 유지합니다.',
      '손목 통증이 있는 학생은 푸시업 바를 사용하거나 무릎을 바닥에 대고 실시합니다.',
      '팔꿈치가 어깨선 위로 과도하게 벌어지지 않도록 45도 각도를 만듭니다.'
    ],
    steps: [
      '양손을 어깨너비보다 약간 넓게 바닥에 짚고 플랭크 자세를 취합니다.',
      '가슴이 바닥에 주먹 하나 높이(봉 또는 센서 기준 90도)까지 팔꿈치를 굽혀 내려갑니다.',
      '가슴과 삼두근의 힘으로 바닥을 힘차게 밀어내며 팔꿈치를 곧게 폅니다.'
    ],
    recommendedRepsOrTime: '남학생 35~45회(1급) / 여학생 20~25회(1급)',
    mode: 'counter',
    defaultGoal: 25,
    unit: '회',
    iconName: 'Shield',
    guideAnimationType: 'push-up',
    calorieBurnPerMin: 7,
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['머리-골반-발목 일직선', '팔꿈치 각도 45도', '가슴 바닥 터치 근접'],
    checkpoints: [
      { title: '완전 가동범위', desc: '팔꿈치가 90도 이하로 굽혀진 후 완전히 펴질 때까지 반복합니다.', isWarning: false },
      { title: '코어 브레이싱', desc: '복근과 둔근에 힘을 주어 허리가 꺾이지 않도록 지탱합니다.', isWarning: false }
    ]
  },
  {
    id: 'paps-sit-and-reach',
    name: '앉아윗몸앞으로굽히기 (좌전굴)',
    category: 'flexibility',
    subType: 'paps_official',
    targetPaps: '유연성 (e-PAPS 유연성 종목)',
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
  // 2. [루프밴드 운동] (Loop Band Workouts for All Fitness Elements)
  // =========================================================================
  {
    id: 'loopband-squat-walk',
    name: '루프밴드 몬스터 워크 & 스쿼트',
    category: 'loopband',
    subType: 'loop_band',
    targetPaps: '근력/근지구력 (둔근·하체 파워)',
    difficulty: '초급',
    targetMuscles: ['중둔근', '대둔근', '대퇴사두근', '고관절 안정근'],
    description: '무릎 위에 탄성 루프밴드를 착용하고 측면 이동 및 스쿼트를 수행하여 힙 딥과 중둔근을 강화하고 무릎 안정성을 높입니다.',
    safetyNotes: [
      '밴드 탄성으로 인해 무릎이 안쪽으로 모이지 않도록 바깥쪽으로 계속 저항합니다.',
      '허리가 과도하게 꺾이지 않도록 코어에 힘을 주고 엉덩이를 뒤로 뺍니다.'
    ],
    steps: [
      '루프밴드를 무릎 위 5cm 허벅지에 걸치고 양발을 골반너비보다 넓게 벌립니다.',
      '엉덩이를 살짝 낮춘 하프 스쿼트 자세에서 좌측으로 10걸음, 우측으로 10걸음 몬스터 워크를 합니다.',
      '제자리로 돌아와 밴드를 바깥으로 밀어내며 스쿼트 15회를 연속 실시합니다.'
    ],
    recommendedRepsOrTime: '좌우 10보 + 스쿼트 15회 (3세트)',
    mode: 'counter',
    defaultGoal: 20,
    unit: '회',
    iconName: 'Dumbbell',
    guideAnimationType: 'squat',
    calorieBurnPerMin: 8,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['무릎 바깥쪽 외회전 텐션 유지', '낮은 기마자세 유지', '발뒤꿈치 체중 지지'],
    checkpoints: [
      { title: '무릎 정렬', desc: '무릎이 두 번째 발가락 방향을 향하도록 밴드 저항을 유지합니다.', isWarning: false },
      { title: '모임 방지', desc: '무릎이 안으로 말리면 관절 부상 위험이 있으니 주의합니다.', isWarning: true }
    ]
  },
  {
    id: 'loopband-glute-bridge',
    name: '루프밴드 글루트 브릿지 & 어브덕션',
    category: 'loopband',
    subType: 'loop_band',
    targetPaps: '근력 & 코어 (엉덩이 힙 드라이브)',
    difficulty: '초급',
    targetMuscles: ['대둔근', '햄스트링', '골반저근', '복횡근'],
    description: '루프밴드의 외측 저항을 받으며 골반을 들어 올려 달리기와 도약에 필수적인 힙 익스텐션 파워를 기릅니다.',
    safetyNotes: [
      '허리를 과도하게 꺾어 들지 말고 엉덩이 근육의 수축력으로 골반을 들어 올립니다.',
      '발바닥이 바닥에서 떨어지지 않도록 지면을 단단히 누릅니다.'
    ],
    steps: [
      '무릎 위 5cm에 루프밴드를 걸고 등을 대고 누워 무릎을 세웁니다.',
      '발뒤꿈치로 바닥을 밀며 엉덩이를 무릎-골반-어깨가 일직선이 될 때까지 들어 올립니다.',
      '최고점에서 양 무릎을 바깥쪽으로 2초간 벌렸다가 천천히 모으며 내려옵니다.'
    ],
    recommendedRepsOrTime: '20회 x 3세트',
    mode: 'counter',
    defaultGoal: 20,
    unit: '회',
    iconName: 'Shield',
    guideAnimationType: 'bridge',
    calorieBurnPerMin: 6,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['발뒤꿈치 밀기', '최고점 2초 둔근 수축', '외측 벌림 유지'],
    checkpoints: [
      { title: '골반 수평', desc: '좌우 골반이 기울어지지 않고 수평을 유지해야 합니다.', isWarning: false }
    ]
  },
  {
    id: 'loopband-lat-pull',
    name: '루프밴드 랫 풀다운 & 숄더 익스텐션',
    category: 'loopband',
    subType: 'loop_band',
    targetPaps: '근력/근지구력 (등·견갑골·자세교정)',
    difficulty: '초급',
    targetMuscles: ['광배근', '승모근 하부', '능형근', '후면삼각근'],
    description: '루프밴드를 양 손목에 걸고 머리 위에서 가슴 쪽으로 당겨 굽은 등을 펴고 강력한 등 근력을 만듭니다.',
    safetyNotes: [
      '팔을 당길 때 어깨가 으쓱 올라가지 않도록 날개뼈를 아래로 내려 고정합니다.',
      '허리를 뒤로 젖히지 않고 복부에 힘을 줍니다.'
    ],
    steps: [
      '루프밴드를 양 손목에 걸고 팔을 머리 위로 곧게 뻗어 팽팽하게 벌립니다.',
      '팔꿈치를 W자 모양으로 옆구리 쪽으로 당기며 날개뼈를 강하게 조여줍니다.',
      '등 근육의 긴장을 느끼며 2초간 멈춘 뒤 천천히 시작 자세로 복귀합니다.'
    ],
    recommendedRepsOrTime: '15~20회 x 3세트',
    mode: 'counter',
    defaultGoal: 15,
    unit: '회',
    iconName: 'Activity',
    guideAnimationType: 'pull',
    calorieBurnPerMin: 5,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['날개뼈 하강 고정', 'W자 팔꿈치 궤적', '등 중앙 조이기'],
    checkpoints: [
      { title: '견갑 조임', desc: '날개뼈 사이에 연필을 꽉 끼운다는 느낌으로 조입니다.', isWarning: false }
    ]
  },
  {
    id: 'loopband-jumping-jack',
    name: '루프밴드 래터럴 점핑잭 (밴드 유산소)',
    category: 'loopband',
    subType: 'loop_band',
    targetPaps: '심폐지구력 (고강도 밴드 인터벌)',
    difficulty: '중급',
    targetMuscles: ['심폐순환계', '중둔근', '전신 근육군'],
    description: '발목에 루프밴드를 걸고 점핑잭을 수행하여 심박수를 빠르게 상승시키고 하체 외전근을 동시에 강화합니다.',
    safetyNotes: [
      '착지 시 앞꿈치부터 부드럽게 닿아 무릎과 발목 충격을 완화합니다.',
      '밴드가 말려 올라가지 않도록 발목 위쪽에 탄탄히 고정합니다.'
    ],
    steps: [
      '루프밴드를 양 발목에 걸고 차렷 자세로 섭니다.',
      '점프하며 양발을 어깨너비 1.5배로 벌림과 동시에 양손을 머리 위로 올려 손뼉을 칩니다.',
      '밴드의 저항을 이겨내며 일정한 템포로 연속 도약합니다.'
    ],
    recommendedRepsOrTime: '30~50회 또는 60초 지속 (3세트)',
    mode: 'counter',
    defaultGoal: 30,
    unit: '회',
    iconName: 'Zap',
    guideAnimationType: 'jump',
    calorieBurnPerMin: 11,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['발목 탄성 저항 극복', '부드러운 앞꿈치 착지', '일정한 유산소 리듬'],
    checkpoints: [
      { title: '착지 완충', desc: '무릎을 10도 굽혀 체중 충격을 흡수합니다.', isWarning: false }
    ]
  },
  {
    id: 'loopband-lateral-bounds',
    name: '루프밴드 저항 사이드 바운드 점프',
    category: 'loopband',
    subType: 'loop_band',
    targetPaps: '순발력 (측면 지면반발력)',
    difficulty: '고급',
    targetMuscles: ['중둔근', '대퇴사두근', '발목 관절', '순발력'],
    description: '무릎 위 루프밴드의 저항을 받으며 좌우로 폭발적인 스케이팅 점프를 하여 방향 전환 능력과 측면 도약력을 높입니다.',
    safetyNotes: [
      '착지하는 발의 무릎이 흔들리지 않도록 단단히 바닥을 딛습니다.',
      '균형을 잃지 않도록 착지 순간 1초간 중심을 잡고 다음 점프로 연결합니다.'
    ],
    steps: [
      '무릎 위에 밴드를 착용하고 오른쪽 다리로 바닥을 차며 좌측으로 1.5m 크게 도약합니다.',
      '왼발로 착지하며 무릎을 굽혀 충격을 흡수하고 1초간 정지합니다.',
      '곧바로 왼발로 지면을 폭발적으로 밀어 우측으로 왕복 도약합니다.'
    ],
    recommendedRepsOrTime: '좌우 왕복 10회 (3세트)',
    mode: 'counter',
    defaultGoal: 15,
    unit: '회',
    iconName: 'Flame',
    guideAnimationType: 'jump',
    calorieBurnPerMin: 12,
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['폭발적 측면 지면 밀기', '안정적 외다리 착지', '고관절 힌지 유지'],
    checkpoints: [
      { title: '외다리 밸런스', desc: '착지 시 상체가 좌우로 흔들리지 않도록 코어를 고정합니다.', isWarning: false }
    ]
  },
  {
    id: 'loopband-hamstring-stretch',
    name: '루프밴드 햄스트링 & 고관절 가동성 스트레칭',
    category: 'loopband',
    subType: 'loop_band',
    targetPaps: '유연성 (체전굴 각도 향상)',
    difficulty: '초급',
    targetMuscles: ['햄스트링', '비복근', '둔근', '고관절 캡슐'],
    description: '발바닥에 루프밴드를 걸고 다리를 들어 올려 햄스트링과 좌골신경 주변을 안전하고 깊게 이완시키는 스트레칭입니다.',
    safetyNotes: [
      '무리하게 당겨 찌릿한 통증이 발생하지 않도록 시원한 당김 수준에서 멈춥니다.',
      '반대쪽 다리가 바닥에서 뜨지 않도록 눌러줍니다.'
    ],
    steps: [
      '바닥에 등을 대고 누워 한쪽 발바닥에 밴드를 걸고 양손으로 밴드 끝을 잡습니다.',
      '무릎을 편 상태로 다리를 천장 방향으로 90도까지 천천히 당겨 올립니다.',
      '허벅지 뒤쪽의 당김을 느끼며 20~30초간 정지 후 발끝을 몸 쪽으로 당겨 종아리까지 이완합니다.'
    ],
    recommendedRepsOrTime: '좌우 각 30초 x 3세트',
    mode: 'timer',
    defaultGoal: 60,
    unit: '초',
    iconName: 'Compass',
    guideAnimationType: 'stretch',
    calorieBurnPerMin: 3,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['무릎 신전 유지', '발끝 발목 굴곡(dorsiflexion)', '20초 지속 호흡'],
    checkpoints: [
      { title: '호흡 지속', desc: '숨을 참지 않고 깊게 내쉬며 가동 범위를 점진적으로 늘립니다.', isWarning: false }
    ]
  },

  // =========================================================================
  // 3. [심폐지구력 러닝 훈련] (Running Training: Intervals & Buildup)
  // =========================================================================
  {
    id: 'running-run-walk-protocol',
    name: '[초급] 런-워크 1:1 인터벌 러닝 (20분 완성)',
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
      '쿨다운 스트레칭으로 종아리와 대퇴부를 정리합니다.'
    ],
    recommendedRepsOrTime: '1분 조깅 + 1분 걷기 x 10세트 (총 20분)',
    mode: 'timer',
    defaultGoal: 300,
    unit: '초',
    iconName: 'Zap',
    guideAnimationType: 'run',
    calorieBurnPerMin: 9,
    imageUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['페이스 오버 방지', '일정한 팔치기 각도', '규칙적인 2박자 호흡'],
    checkpoints: [
      { title: '페이스 컨트롤', desc: '걷기 구간에서도 멈추지 않고 빠른 보폭으로 심박수를 유지합니다.', isWarning: false }
    ]
  },
  {
    id: 'running-pyramid-interval',
    name: '[중급] 피라미드 스피드 인터벌 러닝',
    category: 'running',
    subType: 'running_drill',
    targetPaps: '심폐지구력 (VO2max 최대산소섭취량)',
    difficulty: '중급',
    targetMuscles: ['심폐순환계', '대퇴사두근', '햄스트링', '젖산 내성'],
    description: '30초 질주부터 시작하여 1분, 2분까지 질주 시간을 늘렸다가 다시 줄이는 피라미드 구조의 고효율 심폐 강화 훈련입니다.',
    safetyNotes: [
      '질주 구간에서 85~90% 강도를 유지하되 햄스트링 부상에 주의합니다.',
      '휴식 구간에서는 완전히 멈추지 않고 가볍게 조깅하며 젖산을 분해합니다.'
    ],
    steps: [
      '1단계: 30초 질주 + 30초 조깅',
      '2단계: 60초 질주 + 60초 조깅',
      '3단계: 120초 질주 + 90초 조깅 (피크)',
      '4단계: 60초 질주 + 60초 조깅',
      '5단계: 30초 전력 질주 후 쿨다운'
    ],
    recommendedRepsOrTime: '피라미드 1사이클 (총 15~18분)',
    mode: 'timer',
    defaultGoal: 360,
    unit: '초',
    iconName: 'Flame',
    guideAnimationType: 'run',
    calorieBurnPerMin: 14,
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['시간대별 에너지 분배', '2분 피크 구간 완주', '회복 조깅 유지'],
    checkpoints: [
      { title: '질주 강도', desc: '100m 전력질주가 아닌 85%의 지속 가능한 페이스를 유지합니다.', isWarning: false }
    ]
  },
  {
    id: 'running-buildup-progression',
    name: '[초~중급] 3단계 속도 점증 빌드업 러닝 (15분)',
    category: 'running',
    subType: 'running_drill',
    targetPaps: '심폐지구력 & 페이스 조절 능력',
    difficulty: '중급',
    targetMuscles: ['심폐순환계', '전신 유산소 근지구력'],
    description: '5분마다 속도를 한 단계씩 높여 달리는 점증 부하 훈련으로, 셔틀런 후반부 심폐 한계를 극복하는 최고의 페이싱 훈련입니다.',
    safetyNotes: [
      '처음 5분 동안 너무 빠르게 달리면 3단계에서 탈진할 수 있으니 속도를 철저히 통제합니다.'
    ],
    steps: [
      '1구간 (0~5분): 가볍게 대화 가능한 조깅 속도 (시속 7~8km)',
      '2구간 (5~10분): 대화가 힘들어지는 중간 템포런 (시속 9~10km)',
      '3구간 (10~15분): 셔틀런 목표 속도에 맞춘 강한 질주 (시속 11~12km)'
    ],
    recommendedRepsOrTime: '5분씩 3구간 연속 달리기 (총 15분)',
    mode: 'timer',
    defaultGoal: 300,
    unit: '초',
    iconName: 'TrendingUp',
    guideAnimationType: 'run',
    calorieBurnPerMin: 12,
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['5분 단위 속도 상승', '후반부 집중력 유지', '체류 시간 극복'],
    checkpoints: [
      { title: '점진 가속', desc: '구간 전환 시 갑자기 튀어나가지 않고 서서히 피치를 올립니다.', isWarning: false }
    ]
  },
  {
    id: 'running-tempo-run',
    name: '[중급] 젖산역치 템포 런 지속주 (15분)',
    category: 'running',
    subType: 'running_drill',
    targetPaps: '심폐지구력 (젖산 축적 억제)',
    difficulty: '중급',
    targetMuscles: ['심폐순환계', '지구력 지근 섬유'],
    description: '자신의 최대 심박수의 75~80% 수준으로 일정한 템포를 유지하며 15분간 쉬지 않고 지속적으로 달리는 지구력 강화 훈련입니다.',
    safetyNotes: [
      '일정한 호흡 박자를 맞추고 상체의 힘을 빼서 불필요한 에너지 소모를 줄입니다.'
    ],
    steps: [
      '출발 후 1~2분 내에 목표 템포 페이스에 도달합니다.',
      '호흡을 일정하게 유지하며 15분 동안 속도 저하 없이 균일하게 달립니다.',
      '마지막 1분 동안 속도를 살짝 올려 마무리합니다.'
    ],
    recommendedRepsOrTime: '15분 지속 달리기',
    mode: 'timer',
    defaultGoal: 300,
    unit: '초',
    iconName: 'ShieldAlert',
    guideAnimationType: 'run',
    calorieBurnPerMin: 11,
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['일정한 페이스 유지', '상체 릴랙스', '코어 중심 유지'],
    checkpoints: [
      { title: '페이스 락', desc: '초반에 빨라지거나 후반에 느려지지 않도록 속도계 또는 메트로놈을 활용합니다.', isWarning: false }
    ]
  },
  {
    id: 'running-incline-hill-interval',
    name: '[중급] 계단 & 오르막 힐 인터벌 훈련',
    category: 'running',
    subType: 'running_drill',
    targetPaps: '심폐지구력 & 하체 순발력',
    difficulty: '고급',
    targetMuscles: ['둔근', '대퇴사두근', '종아리', '심폐순환계'],
    description: '경사로 또는 학교 계단을 활용하여 30초간 폭발적으로 올라간 뒤 천천히 걸어 내려오며 심폐와 하지 파워를 동시에 폭발시킵니다.',
    safetyNotes: [
      '계단을 내려올 때는 절대 뛰지 않고 천천히 걸어 내려와 무릎 관절을 보호합니다.'
    ],
    steps: [
      '약 30~50m 오르막 또는 계단 앞에서 준비합니다.',
      '팔을 강하게 치며 무릎을 높이 들어 30초간 빠르게 달려 올라갑니다.',
      '걸어서 출발 지점으로 내려오며 60초간 호흡을 정돈하고 5~8세트 반복합니다.'
    ],
    recommendedRepsOrTime: '30초 오르막 질주 + 60초 하향 보행 x 6세트',
    mode: 'counter',
    defaultGoal: 6,
    unit: '회',
    iconName: 'Flame',
    guideAnimationType: 'run',
    calorieBurnPerMin: 15,
    imageUrl: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['높은 무릎 피치', '강력한 발목 킥', '안전한 하향 보행'],
    checkpoints: [
      { title: '상체 기울기', desc: '경사각에 맞춰 상체를 10도 앞으로 기울여 추진력을 얻습니다.', isWarning: false }
    ]
  },

  // =========================================================================
  // 4. [근력/근지구력 맨몸운동 5종] (Bodyweight Strength & Core: Pushups, Abs, etc.)
  // =========================================================================
  {
    id: 'bodyweight-standard-knee-pushup',
    name: '스탠다드 & 니(Knee) 푸쉬업 (Push-Up Progression)',
    category: 'strength',
    subType: 'bodyweight_core',
    targetPaps: '근력/근지구력 (가슴·삼두 상체 복합)',
    difficulty: '초급',
    targetMuscles: ['대흉근', '삼두근', '전면삼각근', '코어'],
    description: '팔굽혀펴기 초보자부터 숙련자까지 난이도별로 무릎을 대거나 정자세로 상체 미는 힘을 극대화하는 맨몸운동입니다.',
    safetyNotes: [
      '허리가 아래로 꺾이지 않도록 복근에 힘을 유지하고 손목 관절에 체중이 과도하게 쏠리지 않게 합니다.'
    ],
    steps: [
      '초보자는 무릎을 바닥에 대고, 숙련자는 발끝으로 플랭크 자세를 잡습니다.',
      '가슴이 바닥 5cm 전까지 팔꿈치를 45도 각도로 굽히며 천천히 내려갑니다.',
      '바닥을 힘껏 밀어내며 시작 자세로 올라와 가슴을 쥐어짭니다.'
    ],
    recommendedRepsOrTime: '15~25회 x 3세트',
    mode: 'counter',
    defaultGoal: 20,
    unit: '회',
    iconName: 'Shield',
    guideAnimationType: 'push-up',
    calorieBurnPerMin: 7,
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['어깨너비 1.2배 그립', '팔꿈치 45도 외전', '가슴 바닥 밀착'],
    checkpoints: [
      { title: '견갑 안정화', desc: '내려갈 때 날개뼈가 자연스럽게 모이고 올라올 때 펴집니다.', isWarning: false }
    ]
  },
  {
    id: 'bodyweight-diamond-decline-pushup',
    name: '다이아몬드 & 디클라인 푸쉬업 (상급 상체 맨몸)',
    category: 'strength',
    subType: 'bodyweight_core',
    targetPaps: '근력/근지구력 (삼두근·가슴 상부 집중)',
    difficulty: '고급',
    targetMuscles: ['상완삼두근', '대흉근 쇄골두(상부)', '코어'],
    description: '양손 엄지와 검지를 모아 다이아몬드 모양을 만들거나 발을 벤치 위에 올려 삼두근과 가슴 상부에 고강도 자극을 전달합니다.',
    safetyNotes: [
      '손목 부담이 크므로 손목 스트레칭 후 실시하며 통증 시 일반 푸쉬업으로 전환합니다.'
    ],
    steps: [
      '양손 손가락을 모아 가슴 중앙 바로 아래 바닥에 다이아몬드 형태를 만듭니다.',
      '팔꿈치를 몸통에 가깝게 붙이며 가슴이 손등에 닿을 때까지 내려갑니다.',
      '삼두근의 힘으로 바닥을 밀어올립니다.'
    ],
    recommendedRepsOrTime: '10~15회 x 3세트',
    mode: 'counter',
    defaultGoal: 12,
    unit: '회',
    iconName: 'Award',
    guideAnimationType: 'push-up',
    calorieBurnPerMin: 8,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['손목 각도 조절', '팔꿈치 몸통 밀착', '삼두근 수축 집중'],
    checkpoints: [
      { title: '가동범위', desc: '손등에 가슴이 가볍게 스칠 때까지 내려갑니다.', isWarning: false }
    ]
  },
  {
    id: 'bodyweight-hollow-body-hold',
    name: '할로우 바디 홀드 & 락킹 (체조식 복근 압축)',
    category: 'core',
    subType: 'bodyweight_core',
    targetPaps: '근력/근지구력 & 코어 안정성',
    difficulty: '중급',
    targetMuscles: ['복직근 전체', '복횡근', '장요근', '전신 코어 사슬'],
    description: '바나나 모양으로 몸을 만들어 허리를 바닥에 완전히 밀착시키는 기계체조의 기본이자 가장 강력한 복근 강화 훈련입니다.',
    safetyNotes: [
      '허리와 바닥 사이에 손가락이 들어갈 틈이 생기면 즉시 다리를 높이 올려 허리를 바닥에 붙입니다.'
    ],
    steps: [
      '등을 대고 누워 양팔을 머리 위로 뻗고 다리를 곧게 모읍니다.',
      '배꼽을 바닥으로 강하게 누르며 어깨와 다리를 바닥에서 15~20cm 들어 올립니다.',
      '요추를 바닥에 완벽히 밀착시킨 상태로 일정한 호흡을 유지하며 버팁니다.'
    ],
    recommendedRepsOrTime: '30~45초 유지 x 3세트',
    mode: 'timer',
    defaultGoal: 45,
    unit: '초',
    iconName: 'ShieldAlert',
    guideAnimationType: 'plank',
    calorieBurnPerMin: 6,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['허리 바닥 완전 밀착 (Posterior Pelvic Tilt)', '발끝 포인', '균일한 복압'],
    checkpoints: [
      { title: '허리 들림 방지', desc: '허리가 뜨면 복근 대신 허리 관절에 무리가 가므로 주의합니다.', isWarning: true }
    ]
  },
  {
    id: 'bodyweight-mountain-climbers',
    name: '마운틴 클라이머 & 플랭크 숄더 탭',
    category: 'strength',
    subType: 'bodyweight_core',
    targetPaps: '근지구력 & 복근 (심폐 유산소 복합)',
    difficulty: '중급',
    targetMuscles: ['복직근', '장요근', '어깨 안정근', '전신 심폐'],
    description: '엎드린 플랭크 자세에서 무릎을 가슴으로 빠르게 교차 당기며 복근 지구력과 어깨 안정성을 폭발적으로 기릅니다.',
    safetyNotes: [
      '엉덩이가 하늘로 솟지 않도록 수평 플랭크 라인을 유지합니다.'
    ],
    steps: [
      '양손을 어깨 바로 아래에 짚고 하이 플랭크 자세를 취합니다.',
      '오른쪽 무릎을 가슴 중앙 쪽으로 힘차게 당겼다가 원위치하고, 곧바로 왼 무릎을 당깁니다.',
      '달리듯이 리듬감 있게 양다리를 30초간 빠르게 교차합니다.'
    ],
    recommendedRepsOrTime: '30~50회 왕복 (3세트)',
    mode: 'counter',
    defaultGoal: 40,
    unit: '회',
    iconName: 'Activity',
    guideAnimationType: 'climber',
    calorieBurnPerMin: 10,
    imageUrl: 'https://images.unsplash.com/photo-1434596922112-19c563067271?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['골반 높이 고정', '빠른 무릎 당김', '손바닥 지면 압박'],
    checkpoints: [
      { title: '골반 수평', desc: '달릴 때 골반이 좌우로 과도하게 롤링되지 않도록 코어를 잡습니다.', isWarning: false }
    ]
  },
  {
    id: 'bodyweight-leg-raise-russian-twist',
    name: '레그레이즈 & 러시안 트위스트 (하복부·외복사근)',
    category: 'strength',
    subType: 'bodyweight_core',
    targetPaps: '근력/근지구력 (PAPS 복근 1급 완성)',
    difficulty: '중급',
    targetMuscles: ['하복직근', '외복사근', '내복사근'],
    description: '하복부를 들어 올리는 레그레이즈와 상체를 좌우로 회전하는 러시안 트위스트로 복부 360도 근지구력을 완성합니다.',
    safetyNotes: [
      '다리를 내릴 때 허리가 꺾이지 않도록 통제 가능한 각도까지만 내립니다.'
    ],
    steps: [
      '1단계: 등을 대고 누워 다리를 곧게 펴고 90도까지 들어 올렸다가 바닥 5cm 전까지 천천히 내리기 15회',
      '2단계: 상체를 45도 뒤로 기울이고 무릎을 세워 좌우로 상체를 회전하며 바닥 터치 20회',
      '휴식 30초 후 3세트 반복합니다.'
    ],
    recommendedRepsOrTime: '레그레이즈 15회 + 트위스트 20회 (3세트)',
    mode: 'counter',
    defaultGoal: 30,
    unit: '회',
    iconName: 'Zap',
    guideAnimationType: 'curl-up',
    calorieBurnPerMin: 7,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['하복부 긴장 유지', '상체 45도 각도 회전', '복사근 수축'],
    checkpoints: [
      { title: '회전 범위', desc: '손만 움직이지 않고 가슴통 전체를 좌우로 확실하게 회전합니다.', isWarning: false }
    ]
  },

  // =========================================================================
  // 5. [유연성 스트레칭 5종] (Targeted Flexibility: Hip, Calf, Shoulder, Arm, Hamstring)
  // =========================================================================
  {
    id: 'stretch-hip-joint-pigeon',
    name: '대퇴관절 & 고관절 장요근 피죤 스트레칭',
    category: 'stretching',
    subType: 'flexibility_stretch',
    targetPaps: '유연성 (고관절 가동성 & 골반 정렬)',
    difficulty: '초급',
    targetMuscles: ['대퇴근막장근', '이상근', '장요근', '중둔근'],
    description: '오래 앉아 있어 굳어있는 대퇴관절(고관절)과 둔부 깊은 속근육을 풀어주어 달리기 보폭 확장 및 골반 가동성을 높입니다.',
    safetyNotes: [
      '무릎에 통증이 있을 경우 앞쪽 다리의 각도를 90도에서 45도로 좁혀서 진행합니다.'
    ],
    steps: [
      '엎드린 상태에서 한쪽 다리를 기역(ㄱ)자로 구부려 몸통 앞에 두고 반대쪽 다리는 뒤로 곧게 뻗습니다.',
      '양손으로 바닥을 짚고 골반을 바닥 쪽으로 지그시 누르며 상체를 세웁니다.',
      '가능하다면 팔꿈치를 바닥에 대고 상체를 숙여 30초간 깊게 호흡합니다.'
    ],
    recommendedRepsOrTime: '좌우 각 30초 유지 x 3세트',
    mode: 'timer',
    defaultGoal: 60,
    unit: '초',
    iconName: 'Compass',
    guideAnimationType: 'stretch',
    calorieBurnPerMin: 3,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['골반 좌우 수평', '뒷다리 곧게 신전', '날숨 시 깊은 이완'],
    checkpoints: [
      { title: '골반 정렬', desc: '골반이 한쪽으로 기울어지지 않고 바닥과 평행을 유지해야 합니다.', isWarning: false }
    ]
  },
  {
    id: 'stretch-wall-calf-gastrocnemius',
    name: '비복근 & 가자미근 벽 밀기 스트레칭 (종아리/발목)',
    category: 'stretching',
    subType: 'flexibility_stretch',
    targetPaps: '유연성 (비복근·아킬레스건·발목)',
    difficulty: '초급',
    targetMuscles: ['비복근(종아리)', '가자미근', '아킬레스건', '발목 관절'],
    description: '벽을 짚고 뒷다리 뒤꿈치를 바닥에 밀착시켜 셔틀런 및 점프 시 쥐가 나거나 족저근막염이 생기는 것을 완벽히 예방합니다.',
    safetyNotes: [
      '뒷발 뒤꿈치가 바닥에서 뜨지 않도록 끝까지 바닥에 지탱합니다.'
    ],
    steps: [
      '벽을 마주보고 서서 양손으로 벽을 어깨높이로 짚습니다.',
      '스트레칭할 다리를 뒤로 1m가량 크게 빼고 앞다리 무릎을 천천히 굽힙니다.',
      '뒷다리 무릎을 곧게 펴고 발뒤꿈치를 바닥에 강하게 붙인 채 20초간 벽을 밀어냅니다.',
      '이어서 뒷다리 무릎을 살짝 굽혀 심부 가자미근까지 추가로 20초간 이완합니다.'
    ],
    recommendedRepsOrTime: '좌우 각 30~40초 유지 x 3세트',
    mode: 'timer',
    defaultGoal: 60,
    unit: '초',
    iconName: 'Compass',
    guideAnimationType: 'stretch',
    calorieBurnPerMin: 2,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['뒤꿈치 바닥 밀착', '발끝 11자 정렬', '무릎 신전 & 굴곡 2단계'],
    checkpoints: [
      { title: '발끝 방향', desc: '뒷발 끝이 바깥쪽으로 돌아가지 않고 정면을 향해야 정확히 늘어납니다.', isWarning: false }
    ]
  },
  {
    id: 'stretch-shoulder-crossover-chest',
    name: '어깨 크로스오버 & 가슴 회전근개 스트레칭',
    category: 'stretching',
    subType: 'flexibility_stretch',
    targetPaps: '유연성 (어깨 관절·상체 가동성)',
    difficulty: '초급',
    targetMuscles: ['후면삼각근', '회전근개(극하근)', '대흉근', '능형근'],
    description: '한쪽 팔을 가슴 앞을 가로질러 당겨 후면 어깨를 풀고, 벽이나 기둥을 잡고 가슴 전면을 활짝 열어 상체 유연성을 극대화합니다.',
    safetyNotes: [
      '어깨가 귀 쪽으로 솟지 않도록 쇄골을 바르게 펴고 진행합니다.'
    ],
    steps: [
      '오른팔을 가슴 앞을 지나 왼쪽으로 수평으로 뻗습니다.',
      '왼팔 전완으로 오른팔 팔꿈치 위쪽을 감싸 가슴 쪽으로 지그시 당깁니다.',
      '시선은 오른쪽 어깨를 바라보며 20초간 유지 후 반대쪽을 실시합니다.',
      '이어서 벽에 한 손을 대고 몸통을 반대로 회전시켜 가슴 전면을 20초간 엽니다.'
    ],
    recommendedRepsOrTime: '좌우 각 30초 x 3세트',
    mode: 'timer',
    defaultGoal: 60,
    unit: '초',
    iconName: 'Compass',
    guideAnimationType: 'stretch',
    calorieBurnPerMin: 2,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['어깨 하강 유지', '가슴 쪽 수평 밀착', '가슴 회전근개 개방'],
    checkpoints: [
      { title: '몸통 비틀림 방지', desc: '상체는 정면을 유지하고 팔만 가슴 쪽으로 밀착시킵니다.', isWarning: false }
    ]
  },
  {
    id: 'stretch-overhead-triceps-wrist',
    name: '팔 삼두근 & 전완근 손목 굴곡근 스트레칭',
    category: 'stretching',
    subType: 'flexibility_stretch',
    targetPaps: '유연성 (팔·손목 피로 회복)',
    difficulty: '초급',
    targetMuscles: ['상완삼두근', '광배근 상부', '수근굴근', '전완근'],
    description: '팔꿈치를 머리 뒤로 넘겨 삼두근을 늘리고, 손가락을 몸 쪽으로 당겨 푸쉬업 후 쌓인 전완근 피로를 완벽하게 해소합니다.',
    safetyNotes: [
      '손목을 과도하게 꺾지 말고 부드럽게 당겨줍니다.'
    ],
    steps: [
      '오른팔을 머리 위로 들어 팔꿈치를 접어 손이 등 뒤 날개뼈에 닿게 합니다.',
      '왼손으로 오른 팔꿈치를 잡고 아래쪽으로 부드럽게 지그시 누르며 20초간 유지합니다.',
      '이어서 오른팔을 앞으로 뻗고 손바닥이 정면을 보게 한 뒤 왼손으로 손가락 끝을 몸 쪽으로 당겨 전완근을 20초간 스트레칭합니다.'
    ],
    recommendedRepsOrTime: '좌우 각 30초 x 3세트',
    mode: 'timer',
    defaultGoal: 60,
    unit: '초',
    iconName: 'Compass',
    guideAnimationType: 'stretch',
    calorieBurnPerMin: 2,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['머리 뒤 팔꿈치 정렬', '팔꿈치 곧게 펴기', '손가락 전완 당김'],
    checkpoints: [
      { title: '고개 숙임 방지', desc: '팔을 누를 때 고개가 앞으로 꺾이지 않도록 정면을 유지합니다.', isWarning: false }
    ]
  },
  {
    id: 'stretch-seated-hamstring-spine',
    name: '햄스트링 & 요추 후면사슬 좌전굴 스트레칭',
    category: 'stretching',
    subType: 'flexibility_stretch',
    targetPaps: '유연성 (PAPS 앉아윗몸앞으로굽히기 1급)',
    difficulty: '초급',
    targetMuscles: ['햄스트링', '척추기립근', '비복근', '둔근'],
    description: 'PAPS 좌전굴 측정 기록을 즉각적으로 늘리기 위해 햄스트링과 척추 기립근 후면 사슬을 점진적으로 이완시키는 필수 스트레칭입니다.',
    safetyNotes: [
      '반동을 주지 않고 긴 호흡을 내쉬며 1cm씩 손끝을 전진시킵니다.'
    ],
    steps: [
      '다리를 앞으로 곧게 뻗고 바닥에 앉아 발끝을 하늘로 세웁니다.',
      '숨을 들이마시며 척추를 곧게 펴고, 내쉬면서 배꼽부터 허벅지에 닿는 느낌으로 상체를 숙입니다.',
      '발목 또는 발끝을 잡고 30초간 자세를 유지하며 호흡합니다.'
    ],
    recommendedRepsOrTime: '30초 유지 x 3세트',
    mode: 'timer',
    defaultGoal: 60,
    unit: '초',
    iconName: 'Compass',
    guideAnimationType: 'stretch',
    calorieBurnPerMin: 3,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['무릎 바닥 밀착', '배꼽-가슴-이마 순서 숙임', '30초 지속 호흡'],
    checkpoints: [
      { title: '척추 정렬', desc: '등만 구부리지 않고 골반을 앞으로 회전시켜 상체를 숙입니다.', isWarning: false }
    ]
  },

  // =========================================================================
  // 6. [순발력 플라이오메트릭 5종] (Plyometrics for Explosive Power)
  // =========================================================================
  {
    id: 'plyo-power-tuck-jump',
    name: '파워 터크 점프 (Tuck Jump - 무릎 가슴 도약)',
    category: 'plyometrics',
    subType: 'plyometrics',
    targetPaps: '순발력 (순간 하지 폭발력)',
    difficulty: '고급',
    targetMuscles: ['대퇴사두근', '둔근', '장요근', '복근', '종아리'],
    description: '수직으로 최고 높이 도약하여 공중에서 양 무릎을 가슴까지 순간적으로 끌어올리는 최고 난이도의 하지 폭발력 훈련입니다.',
    safetyNotes: [
      '착지 시 발바닥 전체로 부드럽게 무릎을 굽혀 착지 충격을 완충합니다.',
      '무릎이나 허리 질환이 있는 학생은 하프 점프 스쿼트로 대체합니다.'
    ],
    steps: [
      '양발을 어깨너비로 벌리고 선 뒤 팔을 뒤로 젖히며 무릎을 살짝 굽힙니다.',
      '지면을 강하게 박차고 수직으로 솟구치며 공중에서 무릎을 가슴 높이까지 빠르게 당깁니다.',
      '손으로 무릎을 가볍게 터치하고 재빠르게 다리를 펴서 부드럽게 착지합니다.'
    ],
    recommendedRepsOrTime: '8~12회 (3세트, 충분한 휴식)',
    mode: 'counter',
    defaultGoal: 10,
    unit: '회',
    iconName: 'Flame',
    guideAnimationType: 'jump',
    calorieBurnPerMin: 14,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['최대 수직 도약', '공중 무릎 가슴 터치', '스펀지 같은 부드러운 착지'],
    checkpoints: [
      { title: '지면 접촉 시간 최소화', desc: '착지 후 지면에 머무르지 않고 용수철처럼 튀어 오릅니다.', isWarning: false }
    ]
  },
  {
    id: 'plyo-lateral-skater-bounds',
    name: '래터럴 스케이터 바운드 (좌우 파워 바운딩)',
    category: 'plyometrics',
    subType: 'plyometrics',
    targetPaps: '순발력 & 민첩성 (측면 지면반발력)',
    difficulty: '중급',
    targetMuscles: ['중둔근', '대퇴사두근', '발목 안정근', '전신 협응력'],
    description: '스피드 스케이팅 선수처럼 좌우로 강하게 바운딩 도약하여 측면 추진력과 단일 다리 착지 안정성을 향상시킵니다.',
    safetyNotes: [
      '미끄러운 바닥을 피하고 착지 시 무릎이 안쪽으로 꺾이지 않도록 발끝과 일치시킵니다.'
    ],
    steps: [
      '오른발로 서서 무릎을 굽히고 왼발을 뒤로 가볍게 띄웁니다.',
      '오른발로 지면을 강하게 차서 왼쪽으로 1.5m 크게 도약합니다.',
      '왼발로 부드럽게 착지하며 균형을 잡고 곧바로 오른쪽으로 왕복 도약합니다.'
    ],
    recommendedRepsOrTime: '좌우 왕복 12~16회 (3세트)',
    mode: 'counter',
    defaultGoal: 16,
    unit: '회',
    iconName: 'TrendingUp',
    guideAnimationType: 'jump',
    calorieBurnPerMin: 12,
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['측면 도약 거리 확보', '외다리 밸런스 착지', '리듬감 있는 연속 스케이팅'],
    checkpoints: [
      { title: '상체 안정성', desc: '팔을 교차로 흔들어 도약 모멘텀을 극대화합니다.', isWarning: false }
    ]
  },
  {
    id: 'plyo-jump-squat',
    name: '플라이오메트릭 점프 스쿼트 (수직 도약력 극대화)',
    category: 'plyometrics',
    subType: 'plyometrics',
    targetPaps: '순발력 (수직 도약 파워)',
    difficulty: '중급',
    targetMuscles: ['대퇴사두근', '대둔근', '햄스트링', '비복근'],
    description: '스쿼트의 하단 지점에서 저장된 신장-단축 주기(SSC) 탄성에너지를 활용하여 폭발적으로 솟구치는 대표적인 점프 훈련입니다.',
    safetyNotes: [
      '착지 시 발소리가 나지 않도록 앞꿈치부터 부드럽게 닿으며 바로 스쿼트 깊이로 연결합니다.'
    ],
    steps: [
      '양발을 어깨너비로 벌리고 서서 엉덩이를 낮추며 하프 스쿼트 자세로 내려갑니다.',
      '바닥을 강하게 박차고 팔을 위로 뻗으며 최고 높이로 도약합니다.',
      '착지하자마자 충격을 흡수하며 즉시 다음 스쿼트로 연결하여 연속 12회 수행합니다.'
    ],
    recommendedRepsOrTime: '12~15회 (3세트)',
    mode: 'counter',
    defaultGoal: 15,
    unit: '회',
    iconName: 'Flame',
    guideAnimationType: 'squat',
    calorieBurnPerMin: 13,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['바닥 폭발적 킥', '팔 스윙 연동', '연속성 있는 탄성 도약'],
    checkpoints: [
      { title: '착지 완충', desc: '발목과 무릎을 부드럽게 굽혀 관절에 가해지는 충격을 분산합니다.', isWarning: false }
    ]
  },
  {
    id: 'plyo-forward-broad-jump',
    name: '플라이오메트릭 전방 바운딩 & 가속 대시',
    category: 'plyometrics',
    subType: 'plyometrics',
    targetPaps: '순발력 (수평 추진 파워)',
    difficulty: '중급',
    targetMuscles: ['둔근', '대퇴사두근', '발목 관절', '상지 반동'],
    description: '지면을 강하게 박차고 앞으로 도약한 뒤 연속 바운딩과 5m 대시로 연결하여 수평 추진력과 가속력을 기릅니다.',
    safetyNotes: [
      '매트 또는 잔디 위에서 실시하며 착지 시 중심이 뒤로 무너지지 않도록 합니다.'
    ],
    steps: [
      '도약 자세에서 양팔을 뒤로 젖히고 무릎을 굽혀 힘을 응축합니다.',
      '팔을 전상방으로 강하게 뿌리며 2m 이상 앞으로 도약하여 착지합니다.',
      '착지 반동을 살려 연속 3회 바운딩 도약 후 5m 전력 질주로 마무리합니다.'
    ],
    recommendedRepsOrTime: '3단 도약 + 대시 5세트',
    mode: 'counter',
    defaultGoal: 5,
    unit: '회',
    iconName: 'Award',
    guideAnimationType: 'jump',
    calorieBurnPerMin: 12,
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['45도 최적 발사 각도', '공중 무릎 당김', '연속 수평 추진력'],
    checkpoints: [
      { title: '상체 각도', desc: '공중에서 상체가 너무 일찍 서지 않도록 숙인 상태를 유지합니다.', isWarning: false }
    ]
  },
  {
    id: 'plyo-burpee-high-tuck',
    name: '버피 파워 하이 점프 & 플라이오 푸시업',
    category: 'plyometrics',
    subType: 'plyometrics',
    targetPaps: '순발력 & 전신 파워 (심폐 파워 복합)',
    difficulty: '고급',
    targetMuscles: ['전신 대근육군', '심폐순환계', '상하지 폭발력'],
    description: '플로어 푸쉬업에서 가슴을 밀어내는 폭발력과 일어서며 무릎을 가슴 높이로 뛰는 터크 점프를 결합한 전신 순발력 최강 훈련입니다.',
    safetyNotes: [
      '체력 소모가 매우 크므로 무리하게 속도만 내지 말고 동작의 정확성에 집중합니다.'
    ],
    steps: [
      '바닥에 손을 짚고 플랭크 자세로 다리를 뒤로 뺍니다.',
      '가슴을 바닥에 터치한 후 바닥을 강하게 밀며 다리를 손 쪽으로 당겨옵니다.',
      '일어나는 탄성을 이용해 즉시 공중으로 높이 도약하며 무릎을 가슴으로 당겨 손뼉을 칩니다.'
    ],
    recommendedRepsOrTime: '10~15회 (3세트)',
    mode: 'counter',
    defaultGoal: 12,
    unit: '회',
    iconName: 'Flame',
    guideAnimationType: 'burpee',
    calorieBurnPerMin: 16,
    imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['신속한 바닥 반발', '수직 최고 도약', '전신 협응력'],
    checkpoints: [
      { title: '완전 가동', desc: '가슴 바닥 터치와 공중 무릎 당김을 생략하지 않고 정확히 수행합니다.', isWarning: false }
    ]
  },

  // =========================================================================
  // 7. [가정용 배틀로프 운동] (Household & Compact Battle Rope Training)
  // =========================================================================
  {
    id: 'battlerope-double-wave',
    name: '가정용 배틀로프 더블 암 웨이브 (양손 동시 파동)',
    category: 'battlerope',
    subType: 'battle_rope',
    targetPaps: '심폐지구력 & 전신 근지구력 (가정용 앵커/무소음 로프)',
    difficulty: '중급',
    targetMuscles: ['광배근', '전면/측면 삼각근', '대퇴사두근', '복직근', '심폐순환계'],
    description: '문틀 앵커 또는 소음방지 패드가 부착된 가정용 배틀로프를 양손으로 쥐고, 안정적인 하프 스쿼트 자세에서 양팔을 동시에 힘차게 위아래로 흔들어 연속 파동을 일으키는 대표적인 유산소·무산소 복합 운동입니다.',
    safetyNotes: [
      '허리가 둥글게 말리지 않도록 가슴을 펴고 척추 중립을 유지합니다.',
      '가정 내 문틀 앵커나 스트랩이 단단히 고정되어 있는지 시작 전 반드시 점검합니다.',
      '발바닥 전체로 지면을 단단히 딛고 무릎이 안쪽으로 모이지 않도록 주의합니다.'
    ],
    steps: [
      '양발을 어깨너비로 벌리고 엉덩이를 살짝 뒤로 빼 하프 스쿼트 자세를 잡습니다.',
      '양손으로 배틀로프 끝 손잡이를 단단히 쥐고 팔꿈치를 약 90도로 가볍게 구부립니다.',
      '코어와 어깨의 탄력을 이용해 양팔을 가슴 높이까지 동시에 들어 올렸다가 바닥을 향해 내리치며 연속 파동을 유지합니다.'
    ],
    recommendedRepsOrTime: '20~30초 지속 / 15초 휴식 (타바타 4~8세트)',
    mode: 'timer',
    defaultGoal: 30,
    unit: '초',
    iconName: 'Flame',
    guideAnimationType: 'rope',
    calorieBurnPerMin: 14,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['하체 하프스쿼트 고정', '어깨-코어 연동 파동', '20초 인터벌 유지'],
    checkpoints: [
      { title: '코어 복압', desc: '상체가 앞뒤로 흔들리지 않도록 복부에 단단히 힘을 유지합니다.', isWarning: false },
      { title: '어깨 과신전 방지', desc: '팔을 머리 위로 과도하게 들지 않고 가슴 높이에서 일정하게 파동을 끊어칩니다.', isWarning: true }
    ]
  },
  {
    id: 'battlerope-alternating-wave',
    name: '가정용 배틀로프 얼터네이트 웨이브 (교차 파동)',
    category: 'battlerope',
    subType: 'battle_rope',
    targetPaps: '심폐지구력 & 코어 안정성 (어깨 회전근개 & 외복사근)',
    difficulty: '초급',
    targetMuscles: ['삼각근', '이두/삼두박근', '외복사근', '전신 유산소'],
    description: '드럼 스틱을 두드리듯 양팔을 번갈아 가며 빠르게 흔들어 끊김 없는 교차 물결 파동을 만듭니다. 단시간에 심박수를 최고조로 끌어올리고 복부 회전 저항력을 극대화합니다.',
    safetyNotes: [
      '층간소음 방지를 위해 두툼한 요가매트나 소음 흡수 매트 위에서 로프를 타격합니다.',
      '호흡을 멈추지 말고 파동의 템포에 맞춰 짧고 일정하게 호흡을 뱉습니다.'
    ],
    steps: [
      '골반 너비보다 약간 넓게 발을 벌리고 무게중심을 낮춰 안정된 자세를 취합니다.',
      '오른손과 왼손을 빠른 템포로 번갈아 상하로 교차하며 흔듭니다.',
      '로프의 파동이 앵커 고정 지점까지 선명한 물결로 이어지도록 리듬을 유지합니다.'
    ],
    recommendedRepsOrTime: '30초 지속 / 15초 휴식 (3~5세트)',
    mode: 'timer',
    defaultGoal: 30,
    unit: '초',
    iconName: 'Zap',
    guideAnimationType: 'rope',
    calorieBurnPerMin: 13,
    imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['빠르고 일정한 템포', '골반 정면 고정', '지속적인 심박수 유지'],
    checkpoints: [
      { title: '균등한 높이', desc: '오른손과 왼손의 진폭이 짝짝이가 되지 않도록 균일하게 흔듭니다.', isWarning: false },
      { title: '팔꿈치 여유각', desc: '팔을 완전히 펴서 관절에 무리가 가지 않게 가볍게 굽힌 상태를 유지합니다.', isWarning: false }
    ]
  },
  {
    id: 'battlerope-power-slam',
    name: '가정용 배틀로프 오버헤드 파워 슬램 (지면 강타)',
    category: 'battlerope',
    subType: 'battle_rope',
    targetPaps: '순발력 & 전신 근력 (PAPS 순발력 및 배근력 보강)',
    difficulty: '고급',
    targetMuscles: ['광배근', '대둔근', '복직근', '삼각근', '햄스트링'],
    description: '발끝과 둔근의 탄성으로 로프를 머리 위로 높이 들어 올린 뒤, 전신의 체중을 실어 바닥으로 폭발적으로 내리치는 전신 파워 트레이닝입니다.',
    safetyNotes: [
      '바닥 충격을 완화하기 위해 반드시 충격 흡수 매트 위에서 슬램을 수행합니다.',
      '내려칠 때 허리만 숙이지 말고 엉덩이를 뒤로 빼며 고관절(힙 힌지)을 접어 무릎을 굽힙니다.'
    ],
    steps: [
      '로프를 잡고 일어서며 발뒤꿈치를 들고 양팔을 머리 위로 힘껏 뻗어 올립니다.',
      '복근을 강하게 쥐어짜며 엉덩이를 뒤로 튕기듯 앉으면서 로프를 지면에 강력하게 내리칩니다.',
      '지면에 닿는 순간의 충격을 흡수하고 즉시 다음 도약 상승 자세로 부드럽게 연결합니다.'
    ],
    recommendedRepsOrTime: '15~20회 슬램 (3~4세트)',
    mode: 'counter',
    defaultGoal: 15,
    unit: '회',
    iconName: 'Activity',
    guideAnimationType: 'slam',
    calorieBurnPerMin: 15,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['머리 위 완전 신전', '폭발적인 하향 체중 전달', '힙 힌지 안전 착지'],
    checkpoints: [
      { title: '복압 잠금', desc: '내리치는 순간 "흡!" 하고 호흡을 뱉으며 복압을 단단히 고정합니다.', isWarning: false },
      { title: '허리 과신전 주의', desc: '올릴 때 허리가 뒤로 활처럼 꺾이지 않도록 둔근을 조입니다.', isWarning: true }
    ]
  },
  {
    id: 'battlerope-in-out-waves',
    name: '가정용 배틀로프 스네이크 & 횡파동 (수평 수축)',
    category: 'battlerope',
    subType: 'battle_rope',
    targetPaps: '코어 회전 안정성 & 후면 어깨 (자세 교정 및 밸런스)',
    difficulty: '중급',
    targetMuscles: ['후면삼각근', '능형근', '외복사근', '전거근'],
    description: '로프를 지면에 가깝게 유지하며 양손을 좌우 안팎으로 빠르게 박수치듯 움직여 수평 방향의 뱀 모양 파동을 만들어냅니다. 굽은 어깨 교정과 외복사근 강화에 탁월합니다.',
    safetyNotes: [
      '손목이 꺾이지 않도록 중립 그립을 단단히 유지합니다.',
      '어깨가 귀 쪽으로 으쓱 올라가지 않도록 날개뼈를 아래로 눌러 고정합니다.'
    ],
    steps: [
      '무릎을 살짝 굽히고 상체를 약 30도 앞으로 숙여 안정된 기저면을 확보합니다.',
      '양손을 가슴 앞에서 모았다가 바깥쪽으로 벌리며 지면을 쓸듯이 수평 파동을 일으킵니다.',
      '몸통이 좌우로 흔들리지 않도록 코어에 강한 긴장을 유지하며 정해진 시간 동안 지속합니다.'
    ],
    recommendedRepsOrTime: '30초 지속 (3세트)',
    mode: 'timer',
    defaultGoal: 30,
    unit: '초',
    iconName: 'Compass',
    guideAnimationType: 'snake',
    calorieBurnPerMin: 11,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['지면 수평 파동', '견갑골 하강 고정', '외복사근 수축'],
    checkpoints: [
      { title: '좌우 대칭 파동', desc: '양손의 벌림 너비와 속도가 좌우 대칭을 이루도록 집중합니다.', isWarning: false }
    ]
  },
  {
    id: 'battlerope-squat-hold-waves',
    name: '가정용 배틀로프 스쿼트 홀드 웨이브 (하체 고정 버닝)',
    category: 'battlerope',
    subType: 'battle_rope',
    targetPaps: '하체 근지구력 & 전신 심폐 (PAPS 전 종목 기초체력)',
    difficulty: '고급',
    targetMuscles: ['대퇴사두근', '둔근', '척추기립근', '상지 전근육군'],
    description: '허벅지가 지면과 평행한 풀 스쿼트 깊이에서 정지한 채, 상체로는 끊임없이 고강도 로프 웨이브를 몰아치는 고강도 하체·상체 복합 버닝 트레이닝입니다.',
    safetyNotes: [
      '무릎이 발끝보다 너무 앞으로 돌출되지 않도록 체중을 발뒤꿈치와 발바닥 중앙에 둡니다.',
      '시간이 지남에 따라 엉덩이가 슬금슬금 일어서지 않도록 스쿼트 깊이를 엄격히 유지합니다.'
    ],
    steps: [
      '양발을 어깨너비로 벌리고 엉덩이를 깊게 낮추어 허벅지가 바닥과 평행한 스쿼트 홀드 자세를 취합니다.',
      '하체는 바위처럼 고정한 채 양손으로 작고 빠른 고속 파동을 지칠 때까지 몰아칩니다.',
      '호흡을 일정하게 유지하며 목표 시간 동안 흔들림 없이 버팁니다.'
    ],
    recommendedRepsOrTime: '30초 홀드 및 웨이브 (3~4세트)',
    mode: 'timer',
    defaultGoal: 30,
    unit: '초',
    iconName: 'Shield',
    guideAnimationType: 'rope',
    calorieBurnPerMin: 16,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    keyPoints: ['스쿼트 높이 유지', '상하지 독립 협응', '극한의 전신 칼로리 소모'],
    checkpoints: [
      { title: '가슴 펴기', desc: '힘들어도 상체가 앞으로 고꾸라지지 않도록 가슴을 꼿꼿이 세웁니다.', isWarning: true }
    ]
  }
];
