import math     # 수학 모듈 임포트

def log_example(x, y):  # 로그 계산 함수
    return math.log(x, y)

def to_subscript(num): # 숫자를 아래첨자로 변환하는 함수
    subscript_map = str.maketrans("0123456789", "₀₁₂₃₄₅₆₇₈₉")
    return str(num).translate(subscript_map)

while True:
    x = int(input("진수를 입력하세요 (0 입력 시 종료): "))
    if x == 0:
        print("프로그램을 종료합니다.")
        break
    elif x < 0:
        print("진수는 양수여야 합니다. 다시 입력하세요.")
        continue
    elif x == 1:
        print("밑이 1인 로그는 정의되지 않습니다. 다시 입력하세요.")
        continue
    else:
        
        base = int(input("밑을 입력하세요: "))
        result = log_example(x, base) # 로그 계산
        print(f"log{to_subscript(base)}({x}) = {result}")   # 결과 출력
