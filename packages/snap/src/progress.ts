export async function getProgress() {
  const state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });
  if (
    state === null ||
    (typeof state === 'object' && state.progress === undefined)
  ) {
    return {};
  }
  return state.progress;
}

export async function saveProgress(newState:Record<string,unknown>) {
  // The state is automatically encrypted behind the scenes by MetaMask using snap-specific keys
  await wallet.request({
    method: 'snap_manageState',
    params: ['update', { progress: newState }],
  });
}

export async function resetProgress() { 
  await wallet.request({
    method: 'snap_manageState',
    params: ['clear'],
  }); 
}