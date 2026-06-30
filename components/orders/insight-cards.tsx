import MaterialIcon from "@/components/ui/material-icon"

export function InsightCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-popover rounded-xl p-8 border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all flex items-start space-x-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5">
          <MaterialIcon name="eco" size={100} color="var(--secondary)" />
        </div>
        <div className="p-3 bg-secondary/10 rounded-xl text-secondary shrink-0">
          <MaterialIcon name="auto_awesome" size={20} color="var(--secondary)" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-lg">AI Delivery Optimization</h4>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-md">
            Your recent route patterns suggest a 15% fuel reduction if you prioritize clustered deliveries in the
            Lagos Ikeja region today.
          </p>
          <button className="mt-4 text-xs font-extrabold uppercase tracking-widest text-secondary flex items-center space-x-1 group">
            <span>Apply suggested routes</span>
            <MaterialIcon
              name="arrow_forward"
              size={14}
              color="var(--secondary)"
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
      <div className="bg-popover rounded-xl p-8 border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all flex items-start space-x-4">
        <div className="p-3 bg-primary/5 rounded-xl">
          <MaterialIcon name="monitoring" size={20} color="var(--primary)" />
        </div>
        <div>
          <h4 className="font-bold text-primary text-lg">System Health</h4>
          <div className="mt-3 flex items-center space-x-4">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Avg. Time</p>
              <p className="text-xl font-bold text-primary">2.4 hrs</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">On-Time</p>
              <p className="text-xl font-bold text-secondary">98.2%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
