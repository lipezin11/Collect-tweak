/**
 * Collect Tweak - AI Sales Assistant (Vanilla JS Version)
 * V8 - Ultra-Dynamic Response Engine (Anti-Script)
 * No more pre-defined blocks. Prioritizes current intent.
 */

(function() {
    // ── 1. STYLES ──
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.9) translateY(30px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes typing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .chat-assistant-container { font-family: 'Poppins', sans-serif; }
        .chat-assistant-window { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .message-ai { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px 20px 20px 4px; padding: 14px 18px; color: #e4e4e7; font-size: 14px; align-self: flex-start; max-width: 88%; line-height: 1.6; }
        .message-user { background: linear-gradient(135deg, #9048FD 0%, #7B3FE8 100%); border-radius: 20px 20px 4px 20px; padding: 12px 18px; color: white; font-size: 14px; align-self: flex-end; max-width: 85%; box-shadow: 0 4px 15px rgba(144, 72, 253, 0.2); }
        .typing-indicator { display: flex; gap: 4px; padding: 12px 16px; background: rgba(255,255,255,0.03); border-radius: 20px; width: fit-content; }
        .typing-dot { width: 4px; height: 4px; background: #9048FD; border-radius: 50%; opacity: 0.6; }
        .typing-dot:nth-child(1) { animation: typing 1s infinite 0.1s; }
        .typing-dot:nth-child(2) { animation: typing 1s infinite 0.2s; }
        .typing-dot:nth-child(3) { animation: typing 1s infinite 0.3s; }
        b, strong { color: #fff; font-weight: 700; }
    `;
    document.head.appendChild(style);

    // ── 2. HTML ──
    const container = document.createElement('div');
    container.className = 'chat-assistant-container fixed bottom-6 right-6 z-[99999]';
    container.innerHTML = `
        <button id="aiChatButton" class="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-110" 
            style="background: linear-gradient(135deg, #9048FD, #7B3FE8); box-shadow: 0 0 30px rgba(144, 72, 253, 0.6); border: 2px solid rgba(255, 255, 255, 0.2);">
            <div id="aiChatIcon"><i data-lucide="bot" class="w-8 h-8 text-white"></i></div>
            <div class="absolute inset-0 rounded-full animate-ping opacity-20 bg-white"></div>
        </button>

        <div id="aiChatWindow" class="hidden absolute bottom-20 right-0 w-[calc(100vw-48px)] sm:w-[450px] transition-all">
            <div class="flex flex-col rounded-3xl bg-[#080808] border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.9)] overflow-hidden min-h-[500px]">
                <div class="px-6 py-5 border-b border-white/5 bg-gradient-to-r from-brand/10 to-transparent flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center border border-brand/30">
                            <i data-lucide="zap" class="w-6 h-6 text-brand"></i>
                        </div>
                        <div>
                            <div class="text-[13px] font-black uppercase tracking-widest text-white">Jarvis | Tweak Expert</div>
                            <div class="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                                <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Papo Direto
                            </div>
                        </div>
                    </div>
                    <button id="closeAiChat" class="hover:bg-white/5 p-2 rounded-full"><i data-lucide="x" class="w-5 h-5 text-zinc-500"></i></button>
                </div>

                <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-5 scrollbar-none" id="aiChatHistory">
                    <div class="message-ai">
                        E aí! Sou o **Jarvis**. Se seu PC tá engasgando ou o FPS tá caindo bem na hora da trocação, bora resolver. <br><br>Papo reto: o que tá te impedindo de jogar liso hoje?
                    </div>
                </div>

                <div id="aiTyping" class="hidden px-8 pb-4">
                    <div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
                </div>

                <div class="p-5 border-t border-white/5 bg-white/[0.01]">
                    <div class="relative bg-[#111] border border-white/10 rounded-2xl p-4 focus-within:border-brand/50 transition-all">
                        <textarea id="aiChatMessage" rows="2" class="w-full bg-transparent border-none outline-none resize-none text-sm text-white placeholder-zinc-600 mb-2" placeholder="Digite sua dúvida aqui..."></textarea>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                                <i data-lucide="shield-check" class="w-3 h-3 text-green-500"></i> Humano & Real
                            </div>
                            <button id="sendAiMessage" class="p-2.5 bg-brand text-white rounded-xl hover:shadow-[0_0_20px_rgba(144,72,253,0.6)] transition-all">
                                <i data-lucide="send" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const btn = document.getElementById('aiChatButton');
    const windowEl = document.getElementById('aiChatWindow');
    const iconContainer = document.getElementById('aiChatIcon');
    const closeBtn = document.getElementById('closeAiChat');
    const textarea = document.getElementById('aiChatMessage');
    const sendBtn = document.getElementById('sendAiMessage');
    const history = document.getElementById('aiChatHistory');
    const typing = document.getElementById('aiTyping');

    let isOpen = false;

    const toggleChat = () => {
        isOpen = !isOpen;
        windowEl.classList.toggle('hidden', !isOpen);
        if (isOpen) {
            windowEl.classList.add('chat-assistant-window');
            iconContainer.innerHTML = '<i data-lucide="x" class="w-6 h-6 text-white"></i>';
            setTimeout(() => textarea.focus(), 300);
        } else {
            iconContainer.innerHTML = '<i data-lucide="bot" class="w-8 h-8 text-white"></i>';
        }
        if (window.lucide) lucide.createIcons();
    };

    btn.onclick = toggleChat;
    closeBtn.onclick = toggleChat;

    // --- Dynamic Response Logic (Anti-Script) ---
    const generateResponse = (message) => {
        const text = message.toLowerCase();
        
        // Final Pushes (Dynamic Hooks)
        const getHook = () => {
            const hooks = [
                "Melhor testar no seu PC e ver na prática.",
                "Não adianta ficar só no papo, testa e sente a diferença no FPS.",
                "Dá uma chance pro seu hardware mostrar o que realmente pode fazer.",
                "Sério, para de passar raiva com travamento e faz o teste aí."
            ];
            return hooks[Math.floor(Math.random() * hooks.length)];
        };

        // 1. Comparison / Why us? (Pq vcs / Pq pegar com vcs)
        if (text.includes("pq") || text.includes("porque") || text.includes("outra") || text.includes("pessoa") || text.includes("conhecida") || text.includes("diferença")) {
            if (text.includes("pegar") || text.includes("comprar") || text.includes("vcs")) {
                return `Papo reto? Muita gente "conhecida" só repete tutorial de YouTube ou instala programa que enche seu PC de lixo em segundo plano. <br><br>A gente foca no que realmente impacta o Windows e libera rede/CPU pro seu jogo. Não tem mil funções inúteis — é direto no ponto. Além disso, nosso suporte é de quem joga e sente a mesma dor que você.`;
            }
        }

        // 2. Hardware / Setup (Xeon, GTX, etc.) -> ONLY if they are asking about it CURRENTLY
        if (text.match(/xeon|gtx|rtx|ram|gb|i[3579]|ryzen|processador|placa/)) {
            return `Esse setup aí tem muito fôlego parado, papo sério. O Windows é o maior inimigo desse hardware porque ele tenta gerenciar mil coisas que você não usa enquanto joga. <br><br>O Collect Tweak vai dar aquela "limpada" pra sua GPU e CPU focarem 100% no game. Qual o jogo que você mais quer rodar liso?`;
        }

        // 3. Game Specific (Fortnite, etc.)
        if (text.includes("fortnite") || text.includes("valorant") || text.includes("cs2") || text.includes("warzone") || text.includes("cod")) {
            const game = text.includes("fortnite") ? "Fortnite" : "seu jogo";
            return `No ${game}, o que decide o round é o tempo de resposta. A gente força o Windows a focar na sua mira e nos seus comandos (Input Lag baixo) e elimina aquelas quedas de FPS no meio do combate. <br><br>${getHook()}`;
        }

        // 4. Ban / Security
        if (text.includes("ban") || text.includes("perigoso") || text.includes("detecta") || text.includes("seguro")) {
            return `Relaxa, é 100% seguro. A gente não mexe em nenhum arquivo de jogo, só otimizamos como o seu Windows respira. Não tem risco de ban em nenhum anti-cheat.`;
        }

        // 5. Plan recommendation
        if (text.includes("plano") || text.includes("qual") || text.includes("comprar") || text.includes("preço") || text.includes("valor")) {
            return `Pelo custo-benefício, o **Plano PRO Vitalício** é o que mais vira. Mas se quiser ver o poder do tweak antes, o mensal já resolve seu problema de imediato. O importante é seu PC parar de engasgar logo.`;
        }

        // 6. Doubts / Efficacy
        if (text.includes("ajuda") || text.includes("funciona") || text.includes("vale") || text.includes("realmente")) {
            return `Funciona sim. A maioria das pessoas acha que precisa gastar com peça nova... mas na real o Windows só tá sufocando o PC. A gente libera essa potência presa. <br><br>${getHook()}`;
        }

        // 7. General Stuttering
        if (text.includes("trav") || text.includes("lag") || text.includes("lento") || text.includes("stutter")) {
            return `Isso é o clássico sistema "sufocado". Acontece mais do que deveria e dá um ódio perder partida assim, né? Testa aí e você vai sentir o PC liso na primeira partida.`;
        }

        // 8. Default fallback (Conversational)
        return `Entendi seu ponto. Sinceramente? Só testando pra você ver como seu PC realmente pode ser rápido. O que te impede de testar hoje e parar de passar raiva?`;
    };

    const sendMessage = () => {
        const msg = textarea.value.trim();
        if (!msg) return;

        const userDiv = document.createElement('div');
        userDiv.className = 'message-user';
        userDiv.textContent = msg;
        history.appendChild(userDiv);
        textarea.value = '';
        history.scrollTop = history.scrollHeight;

        typing.classList.remove('hidden');
        history.scrollTop = history.scrollHeight;

        setTimeout(() => {
            typing.classList.add('hidden');
            const aiDiv = document.createElement('div');
            aiDiv.className = 'message-ai';
            aiDiv.innerHTML = generateResponse(msg);
            history.appendChild(aiDiv);
            history.scrollTop = history.scrollHeight;
            if (window.lucide) lucide.createIcons();
        }, Math.random() * 400 + 700);
    };

    sendBtn.onclick = sendMessage;
    textarea.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

    if (window.lucide) lucide.createIcons();
})();
