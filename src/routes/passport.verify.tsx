import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Nfc } from "lucide-react";
import { toast } from "sonner";
import { digitalCollectibles, stories } from "@/lib/data";
import { passportStore, simulateVerify } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/passport/verify")({
  head: () => ({ meta: [{ title: "Mô phỏng xác thực NFC – Việt Du Ký" }, { name: "description", content: "Mô phỏng chạm NFC để xác thực và mở khóa bản sưu tầm số." }, { property: "og:title", content: "Mô phỏng xác thực NFC" }, { property: "og:description", content: "Trải nghiệm thử luồng chạm NFC của Hộ chiếu số." }] }),
  component: Verify,
});

type Result = ReturnType<typeof simulateVerify>;

function Verify() {
  const [id, setId] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "fail">("idle");
  const [res, setRes] = useState<Result>(null);
  const unlocked = passportStore.use();

  const verify = () => {
    if (!id.trim()) { setState("fail"); setRes(null); return; }
    setState("loading");
    // Future: replace with a server call that validates a signed NFC payload.
    setTimeout(() => { const r = simulateVerify(id); setRes(r); setState(r ? "ok" : "fail"); }, 900);
  };
  const story = res?.product?.storySlug ? stories.find((s) => s.slug === res.product!.storySlug) : undefined;
  const owned = res ? !!unlocked[res.collectible.id] : false;

  return (
    <div className="container-page max-w-3xl py-14">
      <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-foreground">PROTOTYPE · MÔ PHỎNG</span>
      <h1 className="mt-4 text-4xl md:text-5xl">Xác thực sản phẩm</h1>
      <p className="mt-3 text-muted-foreground">Với sản phẩm thật, bạn chỉ cần chạm điện thoại hỗ trợ NFC vào đế. Trong bản demo, hãy nhập hoặc chọn một mã sưu tầm mẫu. Không có chip NFC nào thực sự được quét và kết quả không phải xác thực chính hãng.</p>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6">
        <label htmlFor="cid" className="text-sm font-medium">Mã sưu tầm</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input id="cid" value={id} onChange={(e) => setId(e.target.value)} placeholder="VD: VDK-TRU-0001" className="h-12 flex-1 rounded-full border border-input bg-background px-5 font-mono uppercase" />
          <Button variant="hero" size="lg" onClick={verify} disabled={state === "loading"}>
            {state === "loading" ? <Loader2 className="animate-spin" /> : <Nfc />} Xác thực sản phẩm
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Mã mẫu:</span>
          {digitalCollectibles.map((d) => <button key={d.id} onClick={() => setId(d.id)} className="rounded-full bg-muted px-3 py-1 font-mono text-xs hover:bg-accent">{d.id}</button>)}
        </div>
      </div>

      {state === "loading" && <p className="mt-6 flex items-center gap-2 text-muted-foreground" role="status"><Loader2 className="size-4 animate-spin" />Đang mô phỏng đọc thẻ…</p>}
      {state === "fail" && (
        <div role="alert" className="mt-6 flex gap-3 rounded-3xl border border-destructive/40 bg-destructive/5 p-5">
          <AlertCircle className="size-6 shrink-0 text-destructive" />
          <div><p className="font-medium">Không tìm thấy mã sưu tầm</p><p className="text-sm text-muted-foreground">Hãy kiểm tra lại mã (định dạng VDK-XXX-0000) hoặc chọn một mã mẫu phía trên.</p></div>
        </div>
      )}
      {state === "ok" && res?.product && (
        <div className="mt-6 overflow-hidden rounded-3xl border-2 border-gold bg-card fade-up">
          <div className="flex items-center gap-2 bg-secondary px-5 py-3 text-sm text-secondary-foreground"><CheckCircle2 className="size-4 text-gold" />Mô phỏng: mã hợp lệ trong dữ liệu demo</div>
          <div className="grid gap-6 p-6 md:grid-cols-[200px_1fr]">
            <img src={res.product.image} alt={res.product.name} width={1024} height={1024} className="aspect-square w-full rounded-2xl object-cover" />
            <div>
              <p className="font-mono text-xs text-muted-foreground">{res.collectible.id} · {res.collectible.serial}</p>
              <h2 className="mt-1 text-3xl">{res.product.name}</h2>
              {story && <p className="mt-2 text-sm text-foreground/80">{story.intro} {story.connection}</p>}
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="gold" disabled={owned} onClick={() => { passportStore.set((u) => ({ ...u, [res.collectible.id]: new Date().toISOString().slice(0, 10) })); toast.success("Đã thêm vào bộ sưu tập demo!"); }}>
                  {owned ? "Đã có trong hộ chiếu" : "Thêm vào hộ chiếu số"}
                </Button>
                <Button asChild variant="outline"><Link to="/passport/collection">Xem bộ sưu tập</Link></Button>
                {story && <Button asChild variant="link"><Link to="/stories/$slug" params={{ slug: story.slug }}>Đọc câu chuyện</Link></Button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
