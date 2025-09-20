import { useState } from 'react'
import { useCookie } from 'arrow-hooks'

export function CookieDemo() {
  const [value, setCookie, removeCookie] = useCookie('demo-cookie', 'default-value')
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="p-6 border rounded-lg bg-muted/50">
      <h4 className="font-semibold mb-4">useCookie 演示</h4>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">当前 Cookie 值:</label>
          <p className="text-lg font-mono bg-background p-2 rounded border">
            {value || '(未设置)'}
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入新的 Cookie 值"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={() => {
              setCookie(inputValue)
              setInputValue('')
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            设置
          </button>
        </div>

        <button
          onClick={() => removeCookie()}
          className="px-4 py-2 border rounded hover:bg-muted"
        >
          删除 Cookie
        </button>
      </div>
    </div>
  )
}