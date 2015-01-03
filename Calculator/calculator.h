#include <iostream>
#include <stdio.h>
#include <math.h>
#include <vector>
#include <algorithm>
#define PI 3.14159265

using namespace std;

typedef vector<vector<double> > DMatrix;
typedef vector<double> DArray;

void interpolateMatrix(DArray &x, DMatrix &M);
DArray l(int j, DArray X);
DArray getLagrangePolinomyal(DArray X, DArray Y);
DArray omega(int j, DArray X);
DArray getNewtonPolinomyal(DArray inpX, DArray inpMDiag);
DArray polynomialAddition(DArray P, DArray Q);
DArray polynomialMultiply(DArray P, DArray Q) ;
void polynomialSimplfy(DArray &P);

void getInterpolationMatrix(DArray X, DMatrix Y, DArray &intpX, DMatrix &intpM) ;

void genXSquaredPoints(DArray &X, DMatrix &Y);
void interpolationTest();
bool testNewton(bool logPoly);
bool testLagrange(bool logPoly);
void interpolationMatrixTest();
void manualInterpolationTest();
void manualPolynomialTest();

bool checkEqual(DArray one, DArray two);

void logPolynomial(DArray P, string poliName);
void logVector(DArray P, string vectorName);
void logResult(DArray x, DMatrix M);
void logCalculate(int i, int j, DMatrix M, DArray x);

void getVectorStd(DArray &P, string poliName);
void getPointsStd(DArray &x, DMatrix &M);

//-----------------------------------------------------------------------
/** @name Számítási függvények */
//@{
/** Interpolációs Táblázat kiszámítása */
void interpolateMatrix(DArray &x, DMatrix &M) {
	int n = M.size();

	cout << endl <<" Kalkulátor Logika: "<< endl;
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

/** Newton polinom összeadás */
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

/** Newton polinom szorzás */
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
void getInterpolationMatrix(DArray X, DMatrix Y, DArray &intpX, DMatrix &intpM) {
	int l;
	for (int i = 0; i < X.size(); ++i) {
		int start = intpM.size();
		int end = start + Y[i].size();
		intpM.resize(end);
		intpX.resize(end, X[i]);
		l = 1;
		for (int j = start; j < end; ++j) {
			intpM[j].resize(l);
			for (int k = 0; k < l; ++k) {
				intpM[j][k] = Y[i][k];
			}
			l++;
		}
	}

	for (int i = 0; i < intpM.size(); ++i) {
		intpM[i].resize(i + 1, -400000);
	}
}
//@}

//-----------------------------------------------------------------------
/** @name Tesztelő és Teszt generáló függvények*/
//@{
/** generál egy minta X,Y ponthalmazt az x^2 pontjaiból */
void genXSquaredPoints(DArray &X, DMatrix &Y) {
	Y.resize(4);
	for (int i = 0; i < 4; ++i) {
		X.push_back(i);
		Y[i].push_back(i*i);
		Y[i].push_back(2*i);
		//Y[i].push_back(2);
	}
}

void interpolationTest() {
	if (testLagrange(false)) {
  		cout << "Lagrange Test: OK!"<<endl;
  	} else {
  		cout << "Lagrange Test Error!"<<endl;
  	}

  	if (testNewton(false)) {
  		cout << "Newton Test: OK!"<<endl;
  	} else {
  		cout << "Newton Test Error!"<<endl;
  	}
}

bool testNewton(bool logPoly) {
	double _X[] = {0,1,2,3};      
  	DArray X(_X,_X+4);
  	double _D[] = {0,10,20,30};        
  	DArray D(_D,_D+4);
  	vector<bool> check;

	double _expect[] = {0,1};
	DArray expect(_expect,_expect+2);
	DArray result = omega(0, X);
  	check.push_back(checkEqual(result, expect));

	double _expect1[] = {0,-1,1};
	DArray expect1(_expect1,_expect1+3);
	DArray result1 = omega(1, X);
  	check.push_back(checkEqual(result1, expect1));

  	double _expect2[] = {0,2,-3,1};
	DArray expect2(_expect2,_expect2+4);
	DArray result2 = omega(2, X);
	check.push_back(checkEqual(result1, expect1));

	double _expect3[] = {0,50,-70,30};
	DArray expect3(_expect2,_expect2+4);
	DArray result3 = getNewtonPolinomyal(X, D);
	check.push_back(checkEqual(result1, expect1));

	if (logPoly) {
		logPolynomial(result, "omega0");
		logPolynomial(result1, "omega1");
		logPolynomial(result2, "omega2");
		logPolynomial(result3, "polynomial");
	}

	bool testcheck = true;
  	for(int i = 0; i < check.size(); ++i){
  		testcheck =  testcheck && check[i];
  	}
  	return testcheck;
}

bool testLagrange(bool logPoly) {
	double _X[] = {0,1,2};      
  	DArray X(_X,_X+3);
  	double _Y[] = {0,10,20};              
  	DArray Y(_Y,_Y+3);
  	vector<bool> check;

	double _E[] = {1,-1.5,0.5};
	DArray result = l(0, X);
	DArray expect(_E,_E+3);
  	check.push_back(checkEqual(result, expect));

	double _E1[] = {0, 2, -1};
	DArray result1 = l(1, X);
	DArray expect1(_E1,_E1+3);
	check.push_back(checkEqual(result1, expect1));

	double _E2[] = {0, -0.5, 0.5};
	DArray result2 = l(2, X);
	DArray expect2(_E2,_E2+3);
	check.push_back(checkEqual(result2, expect2));

  	double _E3[] = {0, 10, 0};
	DArray result3 = getLagrangePolinomyal(X, Y);
	DArray expect3(_E3,_E3+3);
	check.push_back(checkEqual(result3, expect3));
	if (logPoly) {
	  	logPolynomial(result, "l0");
	  	logPolynomial(result1, "l1");
	  	logPolynomial(result2, "l2");
	  	logPolynomial(result3, "result");
	}

  	bool testcheck = true;
  	for(int i = 0; i < check.size(); ++i){
  		testcheck =  testcheck && check[i];
  	}
  	return testcheck;
}

void interpolationMatrixTest() {
	cout << "Interpolacio" << endl;
	DArray X;
	DMatrix Y;
	DArray intpX;
	DMatrix intpM;
	genXSquaredPoints(X, Y);
	logResult(X, Y);
	//getPointsStd(intpX, intpM);
	getInterpolationMatrix(X, Y, intpX, intpM);
	//logResult(intpX, intpM);
	interpolateMatrix(intpX, intpM);
	logResult(intpX, intpM);
}

void manualInterpolationTest() {
	DArray D, X, Y, Res;
	getVectorStd(X, "XResult");
	getVectorStd(Y, "YResult");
	getVectorStd(D, "DiagonalResult");

	logVector(X, "X");
	logVector(Y, "Y");
	logVector(D, "DiagonalResult");

	Res = getLagrangePolinomyal(X, Y);
	polynomialSimplfy(Res);
	logPolynomial(Res, "Result");

	Res = getNewtonPolinomyal(X, D);
	polynomialSimplfy(Res);
	logVector(Res, "Result");
}

/** Manuális Polinom tesztelő */
void manualPolynomialTest() {
	DArray P, Q;
	getVectorStd(P, "P");
	getVectorStd(Q, "Q");

	logPolynomial(P, "P");
	logPolynomial(Q, "Q");
	
	DArray R;
	R = polynomialAddition(P, Q);
	logPolynomial(R, "Osszeg");
	R = polynomialMultiply(P, Q);
	logPolynomial(R, "Szorzat");
}
//@}

//-----------------------------------------------------------------------
/** @name Teszteléshez, teszt írásához és program javításhoz használt segédfüggvények */
//@{
/** Két Tömb egyezésének ellenőrzése */
bool checkEqual(DArray one, DArray two) {
	return equal(one.begin(), one.begin() + two.size(), two.begin());
}
//-----------------------------------------------------
/** @name Kiirató függvények */
//@{
/** Polinom alakban jelenít meg egy Vector-t
    Ez kompatibilis a tényleges számítással.
    (WolframAlpha-ba egyszerűen bemásolható) */
void logPolynomial(DArray P, string poliName) {
	polynomialSimplfy(P);
	cout << poliName << endl;
	int forSize = P.size() - 1;
	for (unsigned i = 0; i < forSize; i++) {
		if (P[i] == 0){
			continue;
		}
		cout<< P[i] <<" x^"<<i<<" + ";
	};
	cout<< P[forSize] <<" x^"<< forSize << endl; 
}

/** Kiírja egymás után egy Vector elemeit a képernyőre */
void logVector(DArray P, string vectorName) {
	cout << vectorName << endl;
	for (unsigned i = 0; i < P.size(); i++) {
		cout<< P[i] <<" ";
	};
	cout<< endl; 
}

/** Kiírja az Interpolációs Mátrix és az X eredményét */
void logResult(DArray x, DMatrix M) {
	cout << endl <<" Eredmény: "<< M.size() << endl;
	for (int i = 0; i < M.size(); i++) {
		cout<<x[i]<<" | ";
		for (int j = 0; j < M[i].size(); j++) {
			cout<<M[i][j]<<"\t";
		}; 
		cout<<"\n";
	};
}

/** Kiírja az Interpolációs Mátrix számítási logikájának egy részletét */
void logCalculate(int i, int j, DMatrix M, DArray x) {
	if (x[j] == x[j-i]){
		return;
	}
	cout << i << j << " = ";
	cout << i-1 << j << " - " << i-1 << j-1 << " // " << j << j-i;
	cout << endl;
	cout << M[j][i-1] << " - " << M[j-1][i-1] << " / " << x[j] <<" - "<< x[j-i];
	cout << " = " << M[j][i-1]-M[j-1][i-1] << "/" << x[j]-x[j-i];
	cout << " = " <<  (M[j][i-1]-M[j-1][i-1])/(x[j]-x[j-i]);
	cout << endl;
}
//@}
//-----------------------------------------------------
/** @name Manuális bekérő függvények */
//@{
/** Vektor (Polinom, Ponthalmaz)*/
void getVectorStd(DArray &P, string poliName) {
	int n;
	cout << poliName <<"\n mekkora? (fok, hossz) n= "; cin >> n;
	P.resize(n);
	for (unsigned i = 0; i < P.size(); i++) {
	 	cout << i << " . elem/tag :"; cin >> P[i];
	};
}
/** Pontok Newton-hoz (X és a kezdő mátrix Y pontjai)*/
void getPointsStd(DArray &x, DMatrix &M) {
	int n;
	cout<<"Adja meg hany pontban vizsgaljuk!"<<endl; 
	cin>>n;
	x.resize(n);
	M.resize(n);
	for (int i = 0; i < n; i++) { 
		M[i].resize(n);
		for (int j = 0; j < n; j++) {
			M[i][j] = 0;
		}
	}

	cout<<"Adja meg a pontokat!"<<endl;
	for (int i = 0; i < n; i++) { 
		cout << i+1 << ". pont: " <<  endl; 
		cout << "\tx: "; cin >> x[i];
		cout << "\tf(x): "; cin >> M[0][i];
	};
}
//@}
//@}