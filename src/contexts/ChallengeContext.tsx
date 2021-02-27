import { createContext, ReactNode, useEffect, useState } from "react";
import challenges from '../../challenges.json';

interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}
interface ChallengesContextData {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  activeChallenge: Challenge;
  experienceToNextLevel: number;
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
}

interface ChallengesProviderProps {
  children: ReactNode;
}


export const ChallengesContext = createContext({} as ChallengesContextData);


export function ChallengesProvider({children}: ChallengesProviderProps) {
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState(null);

  const experienceToNextLevel = Math.pow((level + 1) *4 , 2);

  useEffect(() => {
    Notification.requestPermission();
  }, []); //quando o array ta vazio ele executa uma única vezquando o componente é exibido em tela

  function levelUp() {
    setLevel(level + 1);
  }

  function startNewChallenge() {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];
    
    setActiveChallenge(challenge);

    new Audio('/notification.mp3').play();

    if (Notification.permission === 'granted'){
      new Notification("Novo desafio !!", {
        body: `Valendo ${challenge.amount}xp`
      })
    }
  }

  function resetChallenge(){
    setActiveChallenge(null);
  }

  function completeChallenge(){
    if(!activeChallenge){ // senão tiver challenge ativo
      return;
    }

    const { amount } = activeChallenge;

    // let vem de let it changes - curiosidade
    let finalExperience = currentExperience + amount;

    if(finalExperience >= experienceToNextLevel){
      finalExperience = finalExperience - experienceToNextLevel;
      levelUp();
    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengesCompleted(challengesCompleted + 1);
  }

  return (
    <ChallengesContext.Provider 
      value={{ 
        level, 
        currentExperience, 
        challengesCompleted ,
        activeChallenge, 
        experienceToNextLevel,
        levelUp, 
        startNewChallenge,
        resetChallenge,
        completeChallenge,
      }}
    >
      {children}
    </ChallengesContext.Provider>
  )
}