include("bs.jl")
include("crr.jl")
include("lr.jl")
include("mc.jl")
include("jr.jl")

S = 100.0  # Current stock price
K = 100.0  # Strike price
T = 1.0    # Time to maturity (in years)
r = 0.05   # Risk-free rate
σ = 0.2    # Volatility

N = 1001   # Number of time steps for tree methods
M = 100000 # Number of simulations for Monte Carlo

CRRcall_price = CRR.CRRcall(S, K, T, r, σ, N)
CRRput_price = CRR.CRRput(S, K, T, r, σ, N)
BScall_price = BS.BScall(S, K, T, r, σ)
BSput_price = BS.BSput(S, K, T, r, σ)
LRcall_price = LR.LRcall(S, K, T, r, σ, N)
LRput_price = LR.LRput(S, K, T, r, σ, N)
JRcall_price = JR.JRcall(S, K, T, r, σ, N)
JRput_price = JR.JRput(S, K, T, r, σ, N)
MCcall_price = MC.MCcall(S, K, T, r, σ, N, M)
MCput_price = MC.MCput(S, K, T, r, σ, N, M)

println("CRR Call Price: ", CRRcall_price)
println("CRR Put Price: ", CRRput_price)
println("BS Call Price: ", BScall_price)
println("BS Put Price: ", BSput_price)
println("LR Call Price: ", LRcall_price)
println("LR Put Price: ", LRput_price)
println("JR Call Price: ", JRcall_price)
println("JR Put Price: ", JRput_price)
println("MC Call Price: ", MCcall_price)
println("MC Put Price: ", MCput_price)