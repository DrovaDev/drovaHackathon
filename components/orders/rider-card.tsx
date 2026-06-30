import MaterialIcon from "@/components/ui/material-icon"

type Props = {
  riderName?: string
  riderRating?: number
  riderDeliveries?: number
  riderVehicle?: string
  riderLicense?: string
  phone?: string
}

export function RiderCard({ riderName, riderRating, riderDeliveries, riderVehicle, riderLicense, phone }: Props) {
  return (
    <div className="bg-primary text-white rounded-xl p-8 border border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all relative overflow-hidden group">
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary rounded-full opacity-20 blur-3xl transition-all group-hover:scale-110" />
      <div className="relative z-10 space-y-6">
        <h3 className="font-bold text-lg">Assigned Rider</h3>
        {riderName ? (
          <>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl border-2 border-primary-fixed-dim bg-white/20 flex items-center justify-center shrink-0">
                <MaterialIcon name="person" size={32} color="white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold truncate">{riderName}</p>
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                    >
                      <MaterialIcon name="call" size={16} color="white" />
                    </a>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-chart-2 mt-0.5">
                  <MaterialIcon name="star" size={14} color="currentColor" isFilled />
                  <span className="text-sm font-bold">{riderRating}</span>
                  <span className="text-white/40 text-xs font-medium ml-1">({riderDeliveries?.toLocaleString()} deliveries)</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Vehicle</span>
                <span className="font-bold">{riderVehicle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">License Plate</span>
                <span className="font-bold px-2 py-0.5 bg-white/10 rounded uppercase tracking-tighter">{riderLicense}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <MaterialIcon name="person_search" size={40} color="var(--chart-2)" />
            <p className="text-white/70 text-sm mt-3">No rider assigned yet</p>
            <p className="text-white/40 text-xs mt-1">A rider will be assigned once the order is processed.</p>
          </div>
        )}
      </div>
    </div>
  )
}
