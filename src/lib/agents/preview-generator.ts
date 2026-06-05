export function getPreviewHtml(projectType: string, projectName: string): string {
  const baseHead = `
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: white; margin: 0; padding: 20px; }
      .glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; }
    </style>
  `;

  if (projectType === 'game') {
    return `
      <!DOCTYPE html>
      <html>
      <head>${baseHead}</head>
      <body class="flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-3xl font-bold mb-4 text-cyan-400">${projectName}</h1>
        <p id="status" class="text-xl mb-8 text-white">Player X's turn</p>
        <div id="board" class="grid grid-cols-3 gap-2 p-4 glass w-72 h-72">
          ${Array(9).fill(0).map((_, i) => `<div class="glass flex items-center justify-center text-5xl font-bold cursor-pointer hover:bg-white/10 transition-colors" onclick="makeMove(${i}, this)"></div>`).join('')}
        </div>
        <button class="mt-8 px-6 py-2 bg-cyan-600 rounded-full font-semibold hover:bg-cyan-500 transition-colors" onclick="resetGame()">Restart Game</button>
        
        <script>
          let board = Array(9).fill(null);
          let xIsNext = true;
          let gameOver = false;
          
          function calculateWinner(squares) {
            const lines = [
              [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
              [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
              [0, 4, 8], [2, 4, 6]             // diagonals
            ];
            for (let i = 0; i < lines.length; i++) {
              const [a, b, c] = lines[i];
              if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
              }
            }
            return null;
          }

          function makeMove(i, element) {
            if (board[i] || gameOver) return;
            
            board[i] = xIsNext ? 'X' : 'O';
            element.innerText = board[i];
            element.classList.add(xIsNext ? 'text-cyan-400' : 'text-purple-400');
            
            const winner = calculateWinner(board);
            const statusEl = document.getElementById('status');
            
            if (winner) {
              statusEl.innerText = \`Winner: Player \${winner}!\`;
              statusEl.classList.add('text-green-400');
              gameOver = true;
            } else if (!board.includes(null)) {
              statusEl.innerText = "It's a draw!";
              gameOver = true;
            } else {
              xIsNext = !xIsNext;
              statusEl.innerText = \`Player \${xIsNext ? 'X' : 'O'}'s turn\`;
            }
          }

          function resetGame() {
            board = Array(9).fill(null);
            xIsNext = true;
            gameOver = false;
            document.getElementById('status').innerText = "Player X's turn";
            document.getElementById('status').classList.remove('text-green-400');
            const squares = document.getElementById('board').children;
            for (let i = 0; i < squares.length; i++) {
              squares[i].innerText = '';
              squares[i].classList.remove('text-cyan-400', 'text-purple-400');
            }
          }
        </script>
      </body>
      </html>
    `;
  }

  if (projectType === 'productivity') {
    return `
      <!DOCTYPE html>
      <html>
      <head>${baseHead}</head>
      <body>
        <div class="max-w-md mx-auto glass p-6 mt-10">
          <h1 class="text-2xl font-bold mb-6 text-emerald-400">${projectName} Tasks</h1>
          <div class="flex gap-2 mb-6">
            <input type="text" id="taskInput" placeholder="Add a new task..." class="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-emerald-500">
            <button onclick="addTask()" class="px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 font-semibold">Add</button>
          </div>
          <ul id="taskList" class="space-y-3">
            <li class="glass p-3 flex items-center gap-3"><input type="checkbox" class="w-5 h-5 accent-emerald-500"><span class="flex-1">Complete project setup</span></li>
            <li class="glass p-3 flex items-center gap-3"><input type="checkbox" class="w-5 h-5 accent-emerald-500" checked><span class="flex-1 line-through text-gray-500">Design database schema</span></li>
          </ul>
        </div>
        <script>
          function addTask() {
            const input = document.getElementById('taskInput');
            if (!input.value.trim()) return;
            const li = document.createElement('li');
            li.className = 'glass p-3 flex items-center gap-3';
            li.innerHTML = \`<input type="checkbox" class="w-5 h-5 accent-emerald-500"><span class="flex-1">\${input.value}</span>\`;
            document.getElementById('taskList').prepend(li);
            input.value = '';
          }
        </script>
      </body>
      </html>
    `;
  }

  if (projectType === 'social') {
    return `
      <!DOCTYPE html>
      <html>
      <head>${baseHead}</head>
      <body>
        <div class="max-w-md mx-auto glass flex flex-col mt-10 h-[500px]">
          <div class="p-4 border-b border-white/10">
            <h1 class="text-xl font-bold text-blue-400">${projectName} Chat</h1>
          </div>
          <div id="chat" class="flex-1 p-4 space-y-4 overflow-y-auto flex flex-col">
            <div class="self-start glass p-3 max-w-[80%] rounded-br-none text-sm text-gray-200">Hey, welcome to ${projectName}! 👋</div>
            <div class="self-end bg-blue-600 p-3 max-w-[80%] rounded-xl rounded-bl-none text-sm">Thanks! It looks amazing.</div>
          </div>
          <div class="p-4 border-t border-white/10 flex gap-2">
            <input type="text" id="msgInput" placeholder="Message..." class="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 outline-none focus:border-blue-500">
            <button onclick="sendMsg()" class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500">➤</button>
          </div>
        </div>
        <script>
          function sendMsg() {
            const input = document.getElementById('msgInput');
            if (!input.value.trim()) return;
            const div = document.createElement('div');
            div.className = 'self-end bg-blue-600 p-3 max-w-[80%] rounded-xl rounded-bl-none text-sm mt-4';
            div.innerText = input.value;
            document.getElementById('chat').appendChild(div);
            input.value = '';
            
            setTimeout(() => {
              const reply = document.createElement('div');
              reply.className = 'self-start glass p-3 max-w-[80%] rounded-br-none text-sm text-gray-200 mt-4';
              reply.innerText = "That's cool! I'm an AI responding to you.";
              document.getElementById('chat').appendChild(reply);
            }, 1000);
          }
        </script>
      </body>
      </html>
    `;
  }

  if (projectType === 'dashboard') {
    return `
      <!DOCTYPE html>
      <html>
      <head>${baseHead}</head>
      <body>
        <div class="max-w-4xl mx-auto mt-10">
          <h1 class="text-2xl font-bold mb-6 text-purple-400">${projectName} Analytics</h1>
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="glass p-6 text-center">
              <p class="text-gray-400 text-sm mb-1">Total Users</p>
              <p class="text-3xl font-bold">14,234</p>
              <p class="text-emerald-400 text-xs mt-2">+12.5% this week</p>
            </div>
            <div class="glass p-6 text-center">
              <p class="text-gray-400 text-sm mb-1">Revenue</p>
              <p class="text-3xl font-bold">$45,230</p>
              <p class="text-emerald-400 text-xs mt-2">+8.2% this week</p>
            </div>
            <div class="glass p-6 text-center">
              <p class="text-gray-400 text-sm mb-1">Active Sessions</p>
              <p class="text-3xl font-bold">892</p>
              <p class="text-red-400 text-xs mt-2">-2.1% this week</p>
            </div>
          </div>
          <div class="glass p-6 h-64 flex items-end justify-between gap-2">
            \${[40, 70, 45, 90, 60, 110, 85].map(h => \`<div class="w-full bg-purple-600 hover:bg-purple-500 rounded-t-sm transition-all" style="height: \${h}%;"></div>\`).join('')}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Default web-app
  return `
    <!DOCTYPE html>
    <html>
    <head>${baseHead}</head>
    <body class="flex flex-col items-center justify-center min-h-screen text-center">
      <div class="glass p-12 max-w-lg">
        <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl">🚀</div>
        <h1 class="text-3xl font-bold mb-4 text-white">${projectName}</h1>
        <p class="text-gray-400 mb-8">Welcome to your newly generated web application. The AI agents have successfully compiled the core infrastructure.</p>
        <button class="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors" onclick="alert('Action triggered!')">Get Started</button>
      </div>
    </body>
    </html>
  `;
}
