'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { textbookApi } from '@/lib/api';
import { getLearningNodeExperience } from '@/lib/textbook-data';

export function ListeningTutorBar({ nodeId, scriptIndex = 0 }: { nodeId: string; scriptIndex?: number }) {
  const node = getLearningNodeExperience(nodeId)!;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef('');
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [status, setStatus] = useState('点击播放，听讲师助教讲解本页内容。');
  const currentScript = node.teacherScript[Math.min(Math.max(scriptIndex, 0), Math.max(node.teacherScript.length - 1, 0))] ?? node.headline;
  const speechText = useMemo(() => [
    `${node.title}。`, currentScript,
    `本节需要关注：${node.evidence.map((item) => item.label).join('、')}。`,
    `课堂任务是：${node.practice[0]?.question ?? '依据本页内容形成判断。'}`
  ].join(''), [currentScript, node]);

  useEffect(() => () => stop(), []);
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, [rate]);

  function clearAudio() {
    audioRef.current?.pause();
    audioRef.current = null;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = '';
  }

  function stop() {
    clearAudio();
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    setPlaying(false);
  }

  function browserSpeak() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setStatus('当前浏览器不支持语音播报。');
      setPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(speechText);
    const voice = window.speechSynthesis.getVoices().find((item) => /zh-CN|cmn-Hans-CN/i.test(item.lang));
    if (voice) utterance.voice = voice;
    utterance.lang = 'zh-CN';
    utterance.rate = rate;
    utterance.pitch = 0.9;
    utterance.onend = () => { setPlaying(false); setStatus('本页讲解已完成。'); };
    utterance.onerror = () => { setPlaying(false); setStatus('播报已停止。'); };
    window.speechSynthesis.speak(utterance);
    setStatus('正在使用本机中文语音播报。');
  }

  async function play() {
    stop();
    setPlaying(true);
    setStatus('正在准备讲解音频...');
    try {
      const blob = await textbookApi.tts({ text: speechText });
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.playbackRate = rate;
      audio.onended = () => { clearAudio(); setPlaying(false); setStatus('本页讲解已完成。'); };
      audio.onerror = () => { clearAudio(); browserSpeak(); };
      await audio.play();
      setStatus('正在使用云端中文讲师播报。');
    } catch {
      browserSpeak();
    }
  }

  return <aside className="listening-tutor-bar" aria-label="固定讲师助教">
    <div className="listening-tutor-profile"><img src="/avatars/5g-female-tutor-anime-v2.png" alt="5G网优听讲助教" /><div><strong>听讲助教</strong><span>5G 网优讲师</span></div></div>
    <div className="listening-tutor-script"><i aria-hidden="true">|||</i><strong>第 {scriptIndex + 1} 段 · {node.title}</strong><span>{status}</span></div>
    <div className="listening-tutor-controls"><button aria-label="重新播放" onClick={play} type="button">↺</button><button className="play" aria-label="播放讲解" onClick={play} type="button">{playing ? '播报中' : '播放'}</button><button aria-label="停止播报" onClick={stop} type="button">■</button><label><select aria-label="播放速度" value={rate} onChange={(event) => setRate(Number(event.target.value))}><option value={0.9}>0.9x</option><option value={1}>1.0x</option><option value={1.25}>1.25x</option></select></label></div>
  </aside>;
}
