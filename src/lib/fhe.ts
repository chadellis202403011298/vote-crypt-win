import { initSDK, createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk/bundle";
import { SCALE, getElectionContractAddress } from "@/lib/config";

type RelayerInstance = Awaited<ReturnType<typeof createInstance>>;

let fheInstance: RelayerInstance | null = null;

export async function ensureFheInstance() {
  if (fheInstance) {
    return fheInstance;
  }
  await initSDK();
  fheInstance = await createInstance(SepoliaConfig);
  return fheInstance;
}

interface EncryptionResult {
  candidateHandle: `0x${string}`;
  stakeHandle: `0x${string}`;
  proof: `0x${string}`;
}

export async function encryptElectionPrediction(
  walletAddress: `0x${string}`,
  candidateIndex: number,
  stakeWei: bigint,
): Promise<EncryptionResult> {
  const fhe = await ensureFheInstance();
  const input = fhe.createEncryptedInput(getElectionContractAddress(), walletAddress);
  input.add32(candidateIndex);
  input.add64(stakeWei * SCALE);
  const { handles, inputProof } = await input.encrypt();

  return {
    candidateHandle: handles[0] as `0x${string}`,
    stakeHandle: handles[1] as `0x${string}`,
    proof: inputProof as `0x${string}`,
  };
}
