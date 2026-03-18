import axios from 'axios'
const DEEPSEEK_API_URL = '/__ai/inference/chat/completions'
const MODEL_ID = 'azureml-deepseek/DeepSeek-V3-0324'

const SYSTEM_PROMPT = `你是一位专业的供热运维专家。
请结合提供的实时参数（如温度、压力、流量等），分析当前换热站的运行效率。
如果发现数据异常，请指出潜在风险（如板换结垢、管网泄漏、传感器故障等）。
回复要求：
1. 语气专业、干练、直接。
2. 尽量使用条理清晰的列表。
3. 给出明确的运维建议。`

export const askDeepSeek = async (historyMessages, currentMetrics) => {
  const contextPrompt = `
${SYSTEM_PROMPT}

[系统当前运行指标参考]
${currentMetrics ? JSON.stringify(currentMetrics, null, 2) : '暂无实时数据'}
`

  const messages = [{ role: 'system', content: contextPrompt }, ...historyMessages]

  try {
    const response = await axios.post(DEEPSEEK_API_URL, {
      model: MODEL_ID,
      messages: messages,
      temperature: 0.3,
    })

    return response.data.choices[0].message.content
  } catch (error) {
    if (!error.response) {
      throw new Error('网络请求失败（可能是代理未生效或网络受限），请重启 npm run dev 并检查控制台网络请求')
    }
    throw new Error(
      error.response?.data?.error?.message ||
        error.response?.data?.message ||
        `请求 AI 服务失败（HTTP ${error.response?.status ?? '未知'}），请检查 Token 权限或接口状态`,
    )
  }
}
