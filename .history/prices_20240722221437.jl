include("bs.jl")
include("crr.jl")

S = 100.0  # Current stock price
K = 100.0  # Strike price
T = 1.0    # Time to maturity (in years)
r = 0.05   # Risk-free rate
σ = 0.2    # Volatility

N = 1000   # Number of time steps

CRRcall_price = crr.CRRcall(S, K, T, r, σ, N)
CRRput_price = crr.CRRput(S, K, T, r, σ, N)
BScall_price = bs.bsCall(S, K, T, r, σ)
BSput_price = bs.bsPut(S, K, T, r, σ)

println("CRR Call Price: ", CRRcall_price)
println("CRR Put Price: ", CRRput_price)
println("BS Call Price: ", BScall_price)
println("BS Put Price: ", BSput_price)