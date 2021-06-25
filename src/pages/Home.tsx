
import {useHistory} from "react-router-dom"
import { FormEvent, useState } from "react"
import illustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"
import googleIconImg from "../assets/images/google-icon.svg"

import { database } from "../services/firebase"
import Button from "../components/Button"
import useAuth from "../hooks/useAuth"

import "../styles/auth.scss"

function Home(){
  const history = useHistory();
  const {user, signInWitHGoogle} =  useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom(){
    if (!user) {
      await signInWitHGoogle()
    }

    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent){
    event.preventDefault()

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();
  
    if(!roomRef.exists()){
      alert("A sala não existe.");
      return;
    }

    if (roomRef.val().endedAt) {
      alert("A sala está fechada");
      return;
    }

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie sala de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real.</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Lestmeask" />
          <button className="create-room" onClick={handleCreateRoom}> 
            <img src={googleIconImg} alt="logo do google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
            type="text" 
            placeholder="Digite o código da sala"
            onChange={event => setRoomCode(event.target.value)}
            value ={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Home;