"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export function LikeButton({ initial }: { initial: number }) {
  const [liked, setLiked] = useState(false)
  const count = initial + (liked ? 1 : 0)
  return (
    <Button variant={liked ? "default" : "outline"} onClick={() => setLiked((v) => !v)}>
      <Heart className={cn("mr-1 h-4 w-4", liked && "fill-current")} />
      {count.toLocaleString()}
    </Button>
  )
}
