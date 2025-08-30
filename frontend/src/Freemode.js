import React, { useEffect, useState } from "react";

import Layout from './Layout';

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript"; // 문법 하이라이트

import { styled } from '@mui/material/styles';
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  height: 'auto',
  borderRadius: '4px',
  textAlign: 'center',
  textJustify: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function updateArray(row, col, exp) {
  const newArray = Array(row * col).fill(0);

  // 패턴 탐색 시작
  const pattern = /if\((x|y)(==|!=|>=|<=|>|<)(\d+)\)/; // x|y (>/>=/</<=/==/!=) n

  let noSpace = exp.replace(/\s+/g, ""); // 코드 공백 제거

  const pt1 = noSpace.match(pattern); // x|y (?) n 패턴

  if(pt1) {            
    const target = pt1[1]; // x | y
    const operator = pt1[2]; // == != > < >= <= 

    const coord = parseInt(pt1[3]); // 바꿀 x | y 좌표
    if(coord>=row || coord < 0) {
      console.error('좌표 오류')
      return;
    }
    
    // 연산자 처리
    switch (operator) {
      case "==":
        if (target === 'x') {
          for (let i = 0; i < row; i++) {
            newArray[i * col + coord]++;
          }
        } else {
          for (let i = 0; i < col; i++) {
            newArray[coord * row + i]++;
          }
        }
        break;

      case "!=":
        for (let y = 0; y < row; y++) {
          for (let x = 0; x < col; x++) {
            if ((target === 'x' && x !== coord) || (target === 'y' && y !== coord)) {
              newArray[y * col + x]++;
            }
          }
        }
        break;

      case ">":
        for (let y = 0; y < row; y++) {
          for (let x = 0; x < col; x++) {
            if ((target === 'x' && x > coord) || (target === 'y' && y > coord)) {
              newArray[y * col + x]++;
            }
          }
        }
        break;

      case ">=":
        for (let y = 0; y < row; y++) {
          for (let x = 0; x < col; x++) {
            if ((target === 'x' && x >= coord) || (target === 'y' && y >= coord)) {
              newArray[y * col + x]++;
            }
          }
        }
        break;

      case "<":
        for (let y = 0; y < row; y++) {
          for (let x = 0; x < col; x++) {
            if ((target === 'x' && x < coord) || (target === 'y' && y < coord)) {
              newArray[y * col + x]++;
            }
          }
        }
        break;

      case "<=":
        for (let y = 0; y < row; y++) {
          for (let x = 0; x < col; x++) {
            if ((target === 'x' && x <= coord) || (target === 'y' && y <= coord)) {
              newArray[y * col + x]++;
            }
          }
        }
        break;

      default:
        console.log("알 수 없는 연산자:", operator);
    }
  }
  return newArray;
}


export default function Freemode() {
  const [code, setCode] = useState("array[10][10] = (0, 0, 0);");
  const [arrayInfo, setArrayInfo] = useState({row: 10, col: 10});
  const [array, setArray] = useState(
    Array(100).fill('rgb(0,0,0)')
  );

  // useEffect(() => {
  //   console.log(array);
  // }, [array])

  const handleSubmit = () => {
    try{
      // 배열 정의부
      const definition = /\[(\d+)\]\[(\d+)\]\s*=\s*(\(\s*\d+,\s*\d+,\s*\d+\));/; // array[row][col] = (n,n,n); 형태
      const newArrayInfo = code.match(definition); // 정의 패턴 캡쳐
      if(!newArrayInfo) {
        console.log('array 정보 없음'); // 배열 미정의 예외 처리
      } else {
        newArrayInfo[3] = newArrayInfo[3].replace(/\s+/g, ""); // 색상 코드 공백 제거

        // 배열 row x col 업데이트
        const row = parseInt(newArrayInfo[1])
        const col = parseInt(newArrayInfo[2])
        setArrayInfo({row: row, col: col});
        
        // 색 미지정시 기본값 black
        if(!newArrayInfo[3]) {
          newArrayInfo[3] = '(0,0,0)';
        }
        
        // 색상 코드 오류 처리
        if(!newArrayInfo[3].match(/\((\d+,\d+,\d+)\)/)) {
          newArrayInfo[3] = '(0,0,0)';
        }
        
        // 배열 한 번에 업데이트
        setArray(prev => {
          const newArray = Array(row*col).fill('rgb'+newArrayInfo[3]);

          // 패턴 탐색 시작
          const lines = code.split(';'); // ; 기준으로 파싱
  
          const ptReturn = /return(.+)/; // return (n,n,n)
          const ptAnd = /if\((.+?)&&(.+?)\)/; // if(cond1 && cond2)
          const ptOr= /if\((.+?)\|\|(.+?)\)/; // if(cond1 || cond2)
  
          for(let codeLine=1; codeLine<lines.length; codeLine++) {
            const noSpace = lines[codeLine].replace(/\s+/g, ""); // 코드의 공백 제거
            const operatorAnd = noSpace.match(ptAnd); // && 연산자 추출
            const operatorOr = noSpace.match(ptOr); // || 연산자 추출
            
            // return 구문에서 color 추출
            const rt = noSpace.match(ptReturn); // return 구문 match
            if(!rt) {
              console.error('return 미발견');
              continue;
            }
            const color = 'rgb'+rt[1].replace(/\s+/g, ""); // rgb 코드 문자열로 변환
            
            // 논리연산자 처리
            if(operatorAnd) {
              // && 연산자 처리
              const tmp1 = updateArray(row, col, 'if('+operatorAnd[1]+')'); // 첫번째 조건 배열 추출
              const tmp2 = updateArray(row, col, 'if('+operatorAnd[2]+')'); // 두번째 조건 배열 추출

              if(!tmp1 || !tmp2) {
                console.log('조건 에러');
                continue;
              }

              for (let y = 0; y < row; y++) {
                for (let x = 0; x < col; x++) {
                  if (tmp1[y*col + x] > 0 && tmp2[y*col + x] > 0 ) {
                    newArray[y * col + x] = color;
                  }
                }
              }
            } else if(operatorOr) {
              // || 연산자 처리
              const tmp1 = updateArray(row, col, 'if('+operatorOr[1]+')'); // 첫번째 조건 배열 추출
              const tmp2 = updateArray(row, col, 'if('+operatorOr[2]+')'); // 두번째 조건 배열 추출

              if(!tmp1 || !tmp2) {
                console.log('조건 에러');
                continue;
              }

              for (let y = 0; y < row; y++) {
                for (let x = 0; x < col; x++) {
                  if (tmp1[y*col + x] > 0 || tmp2[y*col + x] > 0 ) {
                    newArray[y * col + x] = color;
                  }
                }
              }
            }
            else {
              // 논리 연산자 없음
              const tmp = updateArray(row, col, lines[codeLine]);
              if(!tmp) continue;
  
              // 해당 좌표 color 적용
              for (let y = 0; y < row; y++) {
                for (let x = 0; x < col; x++) {
                  if (tmp[y*col + x] > 0) {
                    newArray[y * col + x] = color;
                  }
                }
              }
            }
          }

          return newArray; // 배열 적용
        })
      }
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <Layout>
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid size={6} sx={{borderRadius: '4px', overflow: 'hidden'}}>
                  <CodeMirror
                    value={code}
                    height='600px'
                    extensions={[javascript()]}
                    onChange={(value) => {
                      setCode(value);
                    }}
                    theme="dark" // light 또는 dark 테마
                  />
                </Grid>
                <Grid size={6}>
                  <Item>
                    <Grid container spacing={2/arrayInfo.col} sx={{padding: '2px'}}>
                      {array.map((element, index) => (
                        <Grid size={12/arrayInfo.col} sx={{borderRadius: '6px', aspectRatio: '1/1', backgroundColor: element}}>
                        </Grid>
                      ))}
                    </Grid>
                  </Item>
                </Grid>
                <Grid size={6}>
                  <Button variant="contained" onClick={handleSubmit}>
                    submit
                  </Button>
                </Grid>
            </Grid>
        </Box>
    </Layout>
  );
}
