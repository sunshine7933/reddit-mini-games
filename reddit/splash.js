import {requestExpandedMode} from '@devvit/web/client';
document.getElementById('play').addEventListener('click', async event => {
  try { await requestExpandedMode(event, 'game'); }
  catch { document.getElementById('status').textContent = 'Could not open the game. Please tap Play again.'; }
});
