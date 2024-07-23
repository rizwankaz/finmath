include("bs.jl")
include("crr.jl")
include("lr.jl")

S = 100.0  # Current stock price
K = 100.0  # Strike price
T = 1.0    # Time to maturity (in years)
r = 0.05   # Risk-free rate
σ = 0.2    # Volatility

N = 1000   # Number of time steps

CRRcall_price = CRR.CRRcall(S, K, T, r, σ, N)
CRRput_price = CRR.CRRput(S, K, T, r, σ, N)
LRcall_price = LR.LRcall(S, K, T, r, σ, N)
LRput_price = LR.CRRput(S, K, T, r, σ, N)
BScall_price = BS.BScall(S, K, T, r, σ)
BSput_price = BS.BSput(S, K, T, r, σ)

println("CRR Call Price: ", CRRcall_price)
println("CRR Put Price: ", CRRput_price)
println("LR Call Price: ", LRcall_price)
println("LR Put Price: ", LRput_price)
println("BS Call Price: ", BScall_price)
println("BS Put Price: ", BSput_price)