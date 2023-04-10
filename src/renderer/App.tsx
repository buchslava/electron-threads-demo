import { Button, Progress, Spin, Typography } from 'antd';
import './App.css';
import { useEffect, useState } from 'react';

const { Text } = Typography;

export default function App() {
  const [counter, setCounter] = useState<number>();
  const [percent, setPercent] = useState<number>(0);
  const [working, setWorking] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>();

  useEffect(() => {
    setPercent(0);
    setCounter(0);
  }, [working]);

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc-example', (response: any) => {
      if (response.action === 'finish-process') {
        setWorking(false);
      }
      if (response.action === 'count') {
        setCounter(+response.data.count);
        setPercent(+response.data.percent);
      }
    });

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div>
      <div style={{ position: 'fixed', top: 20, left: 20 }}>{currentTime}</div>
      <div style={{ width: '70vw' }}>
        <Progress percent={percent} />
      </div>
      {working && (
        <div style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Spin />
          <Text style={{ marginLeft: 20 }}>{counter} records</Text>
        </div>
      )}
      <Button
        type="primary"
        onClick={() => {
          setWorking(true);
          window.electron.ipcRenderer.sendMessage('ipc-example', [
            'start-process',
          ]);
        }}
      >
        Start
      </Button>{' '}
      <Button
        onClick={() => {
          window.electron.ipcRenderer.sendMessage('ipc-example', [
            'stop-process',
          ]);
        }}
      >
        Stop
      </Button>
    </div>
  );
}
