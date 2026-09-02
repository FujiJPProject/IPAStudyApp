import type { SettledMeaning, SortAlgorithmId } from './domain/sortLogic'

export type FlowNodeType = 'terminal' | 'process' | 'decision' | 'repeat'

export interface FlowNodeDefinition {
  id: string
  label: string
  type: FlowNodeType
}

export interface AlgorithmPresentation {
  id: SortAlgorithmId
  name: string
  settledMeaning: SettledMeaning
  settledLabel: string
  result: string
  why: string
  insight: string
  flow: readonly FlowNodeDefinition[]
}

export const algorithmPresentations: Record<SortAlgorithmId, AlgorithmPresentation> = {
  bubble: {
    id: 'bubble',
    name: 'バブルソート',
    settledMeaning: 'position',
    settledLabel: '位置確定',
    result: '隣接比較を繰り返し、小さい値から大きい値の順に並びました。',
    why: '隣り合う値を比較して大きい値を右へ送る反復により、未確定範囲の末尾から順に位置が確定します。',
    insight: '比較と交換の積み重ねで、大きい値が未確定範囲の右端へ移動する様子を確認できます。',
    flow: [
      { id: 'start', label: '開始', type: 'terminal' },
      { id: 'scan', label: '未確定範囲を反復', type: 'repeat' },
      { id: 'compare', label: '左の値 ＞ 右の値？', type: 'decision' },
      { id: 'swap', label: '必要なら交換', type: 'process' },
      { id: 'settle', label: '末尾位置を確定', type: 'process' },
      { id: 'end', label: '終了', type: 'terminal' },
    ],
  },
  selection: {
    id: 'selection',
    name: '選択ソート',
    settledMeaning: 'position',
    settledLabel: '位置確定',
    result: '未確定範囲の最小値を順に選び、小さい値から大きい値の順に並びました。',
    why: '未確定範囲から最小値を選び、先頭へ移動するたびに1つの位置が確定します。',
    insight: '候補を探す比較回数と、実際に値を移動する回数が別であることを確認できます。',
    flow: [
      { id: 'start', label: '開始', type: 'terminal' },
      { id: 'scan', label: '確定位置ごとに最小値を探索', type: 'repeat' },
      { id: 'compare', label: '探索値 ＜ 最小候補？', type: 'decision' },
      { id: 'move', label: '最小値を先頭へ移動', type: 'process' },
      { id: 'settle', label: '先頭位置を確定', type: 'process' },
      { id: 'end', label: '終了', type: 'terminal' },
    ],
  },
  insertion: {
    id: 'insertion',
    name: '挿入ソート',
    settledMeaning: 'range',
    settledLabel: '整列済み範囲',
    result: '各値を左側の適切な位置へ挿入し、配列全体が昇順に並びました。',
    why: '左側の整列済み範囲へ値を挿入し、その範囲を1要素ずつ広げることで全体が整列します。',
    insight: '値を交換するだけでなく、既存の値を右へ移動して空いた位置へ書き込む処理を確認できます。',
    flow: [
      { id: 'start', label: '開始', type: 'terminal' },
      { id: 'pick', label: '挿入する値を反復して取得', type: 'repeat' },
      { id: 'compare', label: '左の値 ＞ 挿入値？', type: 'decision' },
      { id: 'shift', label: '値を右へ移動', type: 'process' },
      { id: 'insert', label: '挿入値を書き込む', type: 'process' },
      { id: 'settle', label: '整列済み範囲を拡張', type: 'process' },
      { id: 'end', label: '終了', type: 'terminal' },
    ],
  },
  quick: {
    id: 'quick',
    name: 'クイックソート',
    settledMeaning: 'position',
    settledLabel: '位置確定',
    result: '基準値で範囲を分割し、左右を再帰処理して昇順に並びました。',
    why: '基準値より小さい側と大きい側へ分け、左右の範囲を再帰的に同じ方法で整列します。',
    insight: '基準値の位置が確定すると、以後その位置をまたいだ比較が不要になることを確認できます。',
    flow: [
      { id: 'start', label: '開始', type: 'terminal' },
      { id: 'range', label: '処理範囲と基準値を決定', type: 'process' },
      { id: 'compare', label: '探索値 ≦ 基準値？', type: 'decision' },
      { id: 'move', label: '小さい値を左側へ移動', type: 'process' },
      { id: 'place-pivot', label: '基準値を確定位置へ移動', type: 'process' },
      { id: 'settle', label: '基準値の位置を確定', type: 'process' },
      { id: 'recurse', label: '左右の範囲を再帰処理', type: 'process' },
      { id: 'end', label: '終了', type: 'terminal' },
    ],
  },
  merge: {
    id: 'merge',
    name: 'マージソート',
    settledMeaning: 'range',
    settledLabel: '整列済み範囲',
    result: '分割した範囲を小さい値から結合し、配列全体が昇順に並びました。',
    why: '配列を1要素の範囲まで再帰的に分割し、整列済みの左右から小さい値を順に書き込んで結合します。',
    insight: '比較対象は元の隣接位置ではなく、分割した左右の範囲に残る先頭候補であることを確認できます。',
    flow: [
      { id: 'start', label: '開始', type: 'terminal' },
      { id: 'split', label: '範囲を左右へ再帰分割', type: 'process' },
      { id: 'compare', label: '左候補 ≦ 右候補？', type: 'decision' },
      { id: 'write', label: '小さい値を書き込む', type: 'process' },
      { id: 'merge', label: '整列済み範囲として結合', type: 'process' },
      { id: 'end', label: '終了', type: 'terminal' },
    ],
  },
  heap: {
    id: 'heap',
    name: 'ヒープソート',
    settledMeaning: 'position',
    settledLabel: '位置確定',
    result: '最大ヒープから最大値を末尾へ抽出し、昇順に並びました。',
    why: '最大ヒープを作り、根の最大値を末尾へ繰り返し抽出することで右側から位置を確定します。',
    insight: '親子関係から最大候補を根へ集めるヒープ構築と、根を末尾へ移す最大値抽出を区別できます。',
    flow: [
      { id: 'start', label: '開始', type: 'terminal' },
      { id: 'build', label: '最大ヒープを構築', type: 'repeat' },
      { id: 'compare', label: '親より子が大きい？', type: 'decision' },
      { id: 'swap', label: '必要なら親子を交換', type: 'process' },
      { id: 'extract', label: '最大値を末尾へ反復抽出', type: 'repeat' },
      { id: 'settle', label: '末尾位置を確定', type: 'process' },
      { id: 'end', label: '終了', type: 'terminal' },
    ],
  },
  shell: {
    id: 'shell',
    name: 'シェルソート',
    settledMeaning: 'range',
    settledLabel: '整列済み範囲',
    result: 'gapを4、2、1と縮めて値を挿入し、配列全体が昇順に並びました。',
    why: '大きなgapで離れた値を先に整え、gapを半減して最後にgap 1の挿入ソートで全体を整列します。',
    insight: '比較間隔が4、2、1と縮まり、離れた位置の値を早い段階で移動できる様子を確認できます。',
    flow: [
      { id: 'start', label: '開始', type: 'terminal' },
      { id: 'gap', label: 'gapを4 → 2 → 1に変更', type: 'repeat' },
      { id: 'compare', label: 'gap前の値 ＞ 挿入値？', type: 'decision' },
      { id: 'move', label: '値をgap分移動', type: 'process' },
      { id: 'write', label: '挿入値を書き込む', type: 'process' },
      { id: 'settle', label: 'gapごとの処理を完了', type: 'process' },
      { id: 'end', label: '終了', type: 'terminal' },
    ],
  },
}

export const algorithmOptions = Object.values(algorithmPresentations)

export function isSortAlgorithmId(value: string): value is SortAlgorithmId {
  return value in algorithmPresentations
}

