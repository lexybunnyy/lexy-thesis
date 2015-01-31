#include "logTest.h"

//-----------------------------------------------------------------------
/** @name Tesztelő és Teszt generáló függvények*/
//@{

//Interpoláció tesztek lefuttatása
void testInterpolation() {
	if (testMainInterpolation(true)) {
  		cout << "Main Test: OK!"<<endl;
  	} else {
  		cout << "Main Test Error!"<<endl;
  	}

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

//Main Függvény tesztje
bool testMainInterpolation(bool logPoly) {
	double _X[] = {0,10,20,30};
	DArray X(_X,_X+4);
	interpolateMain(X);
}


//Newton számítás tesztje
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

//Lagrange Interpoláció tesztje
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

//Polinom tesztje
void testPolynomial() {
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

//Interpolációs Mátrix tesztje
void testMatrixInterpolation() {
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

//Manuális Interpolációs teszt
void testManualInterpolation() {
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
void testManualPolynomial() {
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

/** generál egy minta X,Y ponthalmazt az x^2 pontjaiból 
//testMatrixInterpolation Segédfüggvénye
//feltölti az x*2 pontjaival 
*/
void genXSquaredPoints(DArray &X, DMatrix &Y) {
	Y.resize(4);
	for (int i = 0; i < 4; ++i) {
		X.push_back(i);
		Y[i].push_back(i*i);
		Y[i].push_back(2*i);
		//Y[i].push_back(2);
	}
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