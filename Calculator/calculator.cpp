#include "calculator.h"

//-----------------------------------------------------------------------
/** @name Számítási függvények */
//@{

DArray interpolateMain (DArray &x, DMatrix &Y, string type, bool inverse) {
	DArray y;
	DArray X;
	DMatrix M;
	DMatrix MDiag;

	if (type == "lagrange") {
		for (DArray Mi : M) {
			y.push_back(Mi[0]);
		}
		if (inverse) {
			return getLagrangePolinomyal(y, x);
		} else {
			return getLagrangePolinomyal(x, y);
		}
	}
	if (type == "newton" || type == "hermite") {
		//TODO Inverse!
		getInterpolationMatrix(x, Y, X, M);
		interpolateMatrix(X, M);
		getDiagFromMatrix(M);
		//return getNewtonPolinomyal(X, MDiag);
	}
	throw "interpolate_wrong_format";
}

DArray getDiagFromMatrix (DMatrix &M) {
	DArray y;
	for (int i = 0; i < M.size(); i++) {
		y.push_back(M[i][i]);
	}
	return y;

}

/** Interpolációs Táblázat kiszámítása */
void interpolateMatrix(DArray &x, DMatrix &M) {
	int n = M.size();

	//cout << endl <<" Kalkulátor Logika: "<< endl;
	for (int i = 1; i < n; i++) {
		for(int j = i; j < n; j++)	{
			//logCalculate(i, j, M, x);
			if (x[j] != x[j-i]) {
				M[j][i] = (M[j][i-1]-M[j-1][i-1])/(x[j]-x[j-i]);
			};
		};
	}
}

/** Lagrange polinom számítás segédfüggvénye */
DArray l(int j, DArray X) {
	DArray multip;
	DArray lj;
	
	int m = 0;
	if(j == m ) {
		m = 1;
	}
	lj.resize(2, 0);
	multip.resize(2, 0);
	
	lj[0] = (-1)*(X[m]/(X[j]-X[m]));
	lj[1] = 1/(X[j]-X[m]);
	//cout << X[m] <<" / "<< X[j]<<" - "<< X[m] << endl;
	//cout << lj[0] <<" "<< lj[1] << endl;
	for (++m; m < X.size(); ++m) {
		if(m != j){
			multip[0] = (-1)*(X[m]/(X[j]-X[m]));
			multip[1] = 1/(X[j]-X[m]);
			//cout << X[m] <<" / "<<X[j]<<" - "<< X[m] << endl;
			//cout << multip[0] <<" "<< multip[1] << endl;
			lj = polynomialMultiply(lj, multip);
			//cout << lj[0] <<" "<< lj[1] <<" "<< lj[2] << endl;
		}
	}
	return lj;
}

/** Lagrange polinom számítás */
DArray getLagrangePolinomyal(DArray X, DArray Y) {
	DArray y(1);

	DArray result;
	DArray multip;

	int j = 0;
	y[0] = Y[j];
	result = polynomialMultiply(y,l(j, X));
	//logPolynomial(result, "resultmulti");
	for (++j; j < X.size(); ++j) {
		y[0] = Y[j];
		multip = polynomialMultiply(y,l(j, X));
		//logPolynomial(multip, "multi");
		result = polynomialAddition(result, multip);
		//logPolynomial(result, "result");
	}
	return result;
}

/** Newton polinom számítás segédfüggvénye */
DArray omega(int j, DArray X) {
	DArray y(1);

	DArray result(2);
	DArray multip(2);

	int m = 0;
	result[0] = (-1)*X[m];
	result[1] = 1;
	for (++m; m <= j; ++m) {
		multip[0] = (-1)*X[m];
		multip[1] = 1;
		result = polynomialMultiply(result, multip);
	}
	return result;
}

/** Newton polinom számítás */
DArray getNewtonPolinomyal(DArray inpX, DArray inpMDiag) {
	DArray y;
	y.resize(1,1);

	DArray result;
	DArray multip;

	int k = 0;
	y[0] = inpMDiag[k];
	result = y;
	for (++k; k < inpX.size(); ++k) {
		y[0] = inpMDiag[k];
		multip = polynomialMultiply(y,omega(k-1, inpX));
		result = polynomialAddition(result, multip);
	}
	return result;
}

/** Polinom összeadás */
DArray polynomialAddition(DArray P, DArray Q) { 
	bool nagyP = false;
	if (P.size() > Q.size()) { 
		nagyP = true;
	}

	DArray S (max(P.size(),Q.size()));
	unsigned k;
	for( k=0;k<min(P.size(),Q.size());k++) { 
		S[k]=P[k]+Q[k];
	};
	if (nagyP) {
		for(unsigned i=k;i<S.size();i++){
			S[i]=P[i]; 
		} 
	} else { 
		for(unsigned i=k;i<S.size();i++){
			S[i]=Q[i];
		}
	};
  return S;
};

/** Polinom szorzás */
DArray polynomialMultiply(DArray P, DArray Q) {
    DArray R((P.size()+Q.size())-1);
    for (unsigned i = 0; i < R.size(); i++) {
    	R[i]=0;
    };
    for (unsigned i = 0; i < P.size(); i++) { 
    	for (unsigned j = 0; j < Q.size(); j++) {  
    		R[i+j] += P[i]*Q[j]; 
   		};
    };
    return R;
};

/** Polinom egyszerűsítés */
void polynomialSimplfy(DArray &P) {
	int end = 0;
	bool endtest = false;
	int m = 0;
	while(m < P.size()) {
		if (endtest && P[m] != 0) {
			endtest = false;
		}
		if (!endtest && P[m] == 0){
			endtest = true;
			end = m;
		}
		++m;
	}

	if (end == 0) {
		end = 1;
	}

	if (endtest) {
		P.resize(end);
	}
}
//@}

//-----------------------------------------------------------------------
/** @name Típus konverziós függvények */
//@{
/** X és Y ponthalmazból vissza adja a Mátrixot */
void getInterpolationMatrix(DArray X, DMatrix Y, DArray &resX, DMatrix &resM) {
	int l;
	for (int i = 0; i < X.size(); ++i) {
		int start = resM.size();
		int end = start + Y[i].size();
		resM.resize(end);
		resX.resize(end, X[i]);
		l = 1;
		for (int j = start; j < end; ++j) {
			resM[j].resize(l);
			for (int k = 0; k < l; ++k) {
				resM[j][k] = Y[i][k];
			}
			l++;
		}
	}

	for (int i = 0; i < resM.size(); ++i) {
		resM[i].resize(i + 1, -400000);
	}
}
//@}