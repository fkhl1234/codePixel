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

export default function CodeEditor() {
  const [code, setCode] = useState("array[10][10];");
  const [array, setArray] = useState({row: 10, col: 10});

  // useEffect() => {

  // }

  const handleSubmit = () => {

    try{
      
      // 배열 정의부
      const definition = /\[(\d+)\]\[(\d+)\]/;
      const newArray = code.match(definition);
      setArray({row: newArray[1], col: newArray[2]});
      
      const lines = code.split(';');
      console.log(lines);

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
                    <Grid container spacing={1} sx={{padding: '2px'}}>
                      {Array.from({length: array.row * array.col}).map((_, index) => (
                        <Grid size={12/array.row} sx={{borderRadius: '6px', aspectRatio: '1/1', backgroundColor: 'black'}}>
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
