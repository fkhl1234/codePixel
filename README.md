# codePixel
C/C++ 기반 코드를 작성해 픽셀을 찍어 봅시다.   

### 기본 문법   
```
// 100 x 100 그리드 설정 - 색상 rgb(255, 255, 255) 설정   
array[100][100] = (255, 255, 255); 

// x>3 범위에 색상 rgb(255, 0, 0) 설정   
if(x>3) return (255, 0, 0);
// x>4 && y>4 범위에 색상 (0, 255, 0) 설정   
if(x>4 && y>4) return (0, 255 ,0);
```
- [ ] `circle()` 함수 추가 (원 그리기 지원)
- [ ] `square()` 함수 추가 (사각형 그리기 지원)
- [ ] `triangle()` 등 기타 도형 함수 추가
- [ ] 도형 스타일 옵션 지원 (색상, 테두리, 채우기 등)
- [ ] 성능 최적화 및 코드 리팩토링
- [ ] 사용자 매뉴얼 및 예제 코드 추가

## 실행
```
git clone https://github.com/fkhl1234/codePixel.git
cd codePixel
cd frontend
npm install
cd ../backend
npm install
```
```
mysql -u [접속 아이디] -p
[비밀번호]
CREATE DATABASE codePixel;
USE codePixel;
```
* `/backend` 에 `.env`  파일 생성
```
DB_NAME=codePixel
DB_USER=[아이디]
DB_PASS=[비밀번호]
DB_HOST=[호스트]
DB_PORT=[포트]
DB_TIMEOUT=[시간제한]
```
```
npm start
```
